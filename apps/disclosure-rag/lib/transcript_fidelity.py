"""
Transcript Fidelity Review

Scores a YouTube transcript's quality before it is ingested into the
knowledge base. Combines cheap deterministic heuristics (coverage, speech
density, gaps, caption artifacts, repetition) with an optional LLM coherence
review. Used by scripts/playlist_ingestion.py as a quality gate.

All functions are fault-tolerant: a scoring failure returns a neutral result
rather than raising, matching the pipeline's never-block philosophy.
"""

import json
import logging
import os
import re
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# Bracketed caption cues that carry no speech content
CUE_PATTERN = re.compile(r"\[(?:music|applause|laughter|inaudible|foreign|__+|\s*)\]", re.IGNORECASE)
# Normal conversational speech falls in this words-per-minute band
WPM_LOW, WPM_HIGH = 90, 220


@dataclass
class FidelityReport:
    video_id: str
    score: float = 0.0                      # composite 0-1
    verdict: str = "unknown"                # pass | review | fail
    word_count: int = 0
    covered_seconds: float = 0.0
    expected_seconds: Optional[float] = None
    words_per_minute: Optional[float] = None
    max_gap_seconds: float = 0.0
    artifact_ratio: float = 0.0
    repetition_ratio: float = 0.0
    subscores: Dict[str, float] = field(default_factory=dict)
    issues: List[str] = field(default_factory=list)
    llm_review: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


def clean_transcript(text: str) -> str:
    """Normalize a raw caption transcript into readable prose.

    Strips non-speech cues, collapses whitespace, and de-duplicates
    consecutive identical lines (a common auto-caption artifact).
    """
    if not text:
        return ""
    text = CUE_PATTERN.sub(" ", text)
    lines = [ln.strip() for ln in text.splitlines()]
    deduped: List[str] = []
    for ln in lines:
        if not ln:
            continue
        if deduped and ln == deduped[-1]:
            continue
        deduped.append(ln)
    text = " ".join(deduped)
    return re.sub(r"\s{2,}", " ", text).strip()


def _segment_stats(segments: List[Dict[str, Any]]) -> Dict[str, float]:
    """Coverage and gap metrics from timed transcript segments."""
    covered_end = 0.0
    max_gap = 0.0
    prev_end = 0.0
    for seg in segments:
        try:
            start = float(seg.get("start", 0.0))
            duration = float(seg.get("duration", 0.0))
        except (TypeError, ValueError):
            continue
        if prev_end and start - prev_end > max_gap:
            max_gap = start - prev_end
        prev_end = max(prev_end, start + duration)
        covered_end = max(covered_end, start + duration)
    return {"covered_seconds": covered_end, "max_gap_seconds": max_gap}


def _repetition_ratio(text: str, window: int = 6) -> float:
    """Fraction of duplicated n-gram windows — high values mean stuck captions."""
    words = text.lower().split()
    if len(words) < window * 2:
        return 0.0
    grams = [" ".join(words[i:i + window]) for i in range(0, len(words) - window, window)]
    if not grams:
        return 0.0
    return 1.0 - (len(set(grams)) / len(grams))


def _taper(value: float, low: float, high: float, hard_low: float, hard_high: float) -> float:
    """1.0 inside [low, high], linear falloff to 0 at hard bounds."""
    if low <= value <= high:
        return 1.0
    if value < low:
        if value <= hard_low:
            return 0.0
        return (value - hard_low) / (low - hard_low)
    if value >= hard_high:
        return 0.0
    return (hard_high - value) / (hard_high - high)


def llm_coherence_review(text: str, video_id: str, model: Optional[str] = None,
                         samples: int = 3, sample_chars: int = 1500) -> Optional[Dict[str, Any]]:
    """Optional LLM pass: rate coherence of sampled transcript chunks 0-1.

    Requires OPENAI_API_KEY. Returns None on any failure.
    """
    try:
        from openai import OpenAI
        client = OpenAI()
        model = model or os.getenv("FIDELITY_REVIEW_MODEL", "gpt-5.5")

        step = max(1, (len(text) - sample_chars) // max(1, samples - 1)) if len(text) > sample_chars else len(text)
        chunks = [text[i:i + sample_chars] for i in range(0, len(text), step)][:samples]

        prompt = (
            "You are reviewing machine-generated podcast transcript excerpts for fidelity. "
            "Rate overall coherence from 0.0 (garbled, unusable) to 1.0 (clean, fully readable), "
            "and list concrete issues (garbled phrases, mid-sentence truncation, wrong-language text, "
            "caption artifacts). Respond ONLY with JSON: "
            '{"coherence": <float>, "issues": [<strings>]}\n\n'
            + "\n---\n".join(chunks)
        )
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        raw = re.sub(r"^```(?:json)?|```$", "", raw, flags=re.MULTILINE).strip()
        data = json.loads(raw)
        return {
            "model": model,
            "coherence": max(0.0, min(1.0, float(data.get("coherence", 0.5)))),
            "issues": [str(i) for i in data.get("issues", [])][:10],
        }
    except Exception as e:
        logger.warning(f"LLM coherence review skipped for {video_id}: {e}")
        return None


def review_transcript(
    transcript: str,
    video_id: str,
    segments: Optional[List[Dict[str, Any]]] = None,
    expected_duration_seconds: Optional[float] = None,
    use_llm: bool = False,
    llm_model: Optional[str] = None,
) -> FidelityReport:
    """Score transcript fidelity 0-1 and assign a verdict.

    Verdicts: 'pass' (>= 0.7), 'review' (0.45-0.7), 'fail' (< 0.45).
    """
    report = FidelityReport(video_id=video_id)
    try:
        raw = transcript or ""
        cleaned = clean_transcript(raw)
        words = cleaned.split()
        report.word_count = len(words)

        if report.word_count < 50:
            report.verdict = "fail"
            report.issues.append(f"Transcript too short ({report.word_count} words)")
            return report

        # Artifact ratio measured against the raw text before cleaning
        cues = len(CUE_PATTERN.findall(raw))
        raw_tokens = max(1, len(raw.split()))
        report.artifact_ratio = round(cues / raw_tokens, 4)

        report.repetition_ratio = round(_repetition_ratio(cleaned), 4)

        seg_stats = _segment_stats(segments or [])
        report.covered_seconds = round(seg_stats["covered_seconds"], 1)
        report.max_gap_seconds = round(seg_stats["max_gap_seconds"], 1)
        report.expected_seconds = expected_duration_seconds

        # --- subscores ---
        subs: Dict[str, float] = {}

        if expected_duration_seconds and report.covered_seconds:
            coverage = min(1.0, report.covered_seconds / expected_duration_seconds)
            subs["coverage"] = coverage
            if coverage < 0.8:
                report.issues.append(
                    f"Captions cover only {coverage:.0%} of the {expected_duration_seconds:.0f}s episode")
        else:
            subs["coverage"] = 0.75  # unknown duration: mild neutral prior

        minutes = (report.covered_seconds or (expected_duration_seconds or 0)) / 60.0
        if minutes > 0.5:
            wpm = report.word_count / minutes
            report.words_per_minute = round(wpm, 1)
            subs["density"] = _taper(wpm, WPM_LOW, WPM_HIGH, 30, 400)
            if subs["density"] < 0.5:
                report.issues.append(f"Abnormal speech density ({wpm:.0f} wpm)")
        else:
            subs["density"] = 0.75

        subs["gaps"] = _taper(report.max_gap_seconds, 0, 20, 0, 180)
        if report.max_gap_seconds > 60:
            report.issues.append(f"Caption gap of {report.max_gap_seconds:.0f}s detected")

        subs["artifacts"] = max(0.0, 1.0 - report.artifact_ratio * 5)
        if report.artifact_ratio > 0.05:
            report.issues.append(f"High non-speech cue ratio ({report.artifact_ratio:.1%})")

        subs["repetition"] = max(0.0, 1.0 - report.repetition_ratio * 4)
        if report.repetition_ratio > 0.15:
            report.issues.append(f"Repeated caption blocks ({report.repetition_ratio:.1%} duplicate n-grams)")

        weights = {"coverage": 0.30, "density": 0.20, "gaps": 0.15, "artifacts": 0.15, "repetition": 0.20}
        score = sum(subs[k] * w for k, w in weights.items())

        if use_llm:
            report.llm_review = llm_coherence_review(cleaned, video_id, model=llm_model)
            if report.llm_review:
                # LLM verdict counts for a third of the final score when available
                score = score * (2 / 3) + report.llm_review["coherence"] * (1 / 3)
                report.issues.extend(report.llm_review.get("issues", []))

        report.subscores = {k: round(v, 3) for k, v in subs.items()}
        report.score = round(score, 3)
        report.verdict = "pass" if score >= 0.7 else ("review" if score >= 0.45 else "fail")
        return report
    except Exception as e:
        logger.warning(f"Fidelity review failed for {video_id}: {e}")
        report.verdict = "review"
        report.score = 0.5
        report.issues.append(f"Fidelity review error: {e}")
        return report
