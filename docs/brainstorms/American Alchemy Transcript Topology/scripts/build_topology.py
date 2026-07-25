#!/usr/bin/env python3
"""
build_topology.py — Deterministic transcript topology builder.

Reads:
  - american_alchemy_transcripts/transcripts/*.md      (115 episode transcripts)
  - american_alchemy_transcripts/manifest.json         (episode metadata)
  - american_alchemy_transcripts/missing_or_unavailable.json (12 missing entries)

Writes:
  - data/topology.json — graph nodes + edges + excerpts + layouts + clusters

No LLM calls. Pure regex + co-occurrence + numpy SVD for 3D embeddings.

Run: python3 scripts/build_topology.py
"""

import json
import math
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
TRANSCRIPT_DIR = WORKSPACE / "american_alchemy_transcripts" / "transcripts"
MANIFEST = WORKSPACE / "american_alchemy_transcripts" / "manifest.json"
MISSING = WORKSPACE / "american_alchemy_transcripts" / "missing_or_unavailable.json"
OUT = ROOT / "data" / "topology.json"


# ─────────────────────────────────────────────────────────────
# Topic vocabulary — curated for the American Alchemy / Jesse
# Michels disclosure / UFO / consciousness / fringe-physics
# domain. Each topic has a canonical label + match patterns
# (case-insensitive whole-word matches). Multi-pattern topics
# capture stems and aliases.
# ─────────────────────────────────────────────────────────────

TOPICS = {
    # Core disclosure / UFO ───────────────────────────────────
    "uap-ufo":           ["uap", "uaps", "ufo", "ufos", "unidentified aerial phenomena", "unidentified aerial", "unidentified anomalous"],
    "disclosure":        ["disclosure", "controlled disclosure"],
    "tic-tac":           ["tic tac", "tic-tac", "nimitz"],
    "roswell":           ["roswell"],
    "area-51":           ["area 51", "area-51", "groom lake", "papoose lake", "s-4", "s4"],
    "skinwalker-ranch":  ["skinwalker ranch", "skinwalker", "skin walker"],
    "non-human-intel":   ["non-human intelligence", "non human intelligence", "nhi", "non-humans"],

    # Programs / agencies ─────────────────────────────────────
    "aatip-aawsap":      ["aatip", "aawsap", "advanced aerospace"],
    "cia":               ["cia", "central intelligence"],
    "darpa":             ["darpa"],
    "dia":               ["defense intelligence agency", "dia "],
    "nsa":               ["nsa", "national security agency"],
    "fbi":               ["fbi", "federal bureau"],
    "nasa":              ["nasa"],
    "pentagon":          ["pentagon", "department of defense", "dod "],
    "congress-senate":   ["congressional", "congress", "senate", "house committee", "subcommittee"],
    "whistleblower":     ["whistleblower", "whistle blower", "whistle-blower"],
    "schedule-f-saps":   ["special access program", "saps", "unacknowledged saps", "compartmented"],

    # People-as-topics (movements/figures referenced as concepts) ─
    "manhattan-project": ["manhattan project", "los alamos"],
    "skunk-works":       ["skunk works", "lockheed skunk"],

    # Abduction / experiencer ─────────────────────────────────
    "abduction":         ["abduction", "abducted", "abductees", "abductee"],
    "experiencer":       ["experiencer", "experiencers", "contactee", "contactees"],
    "missing-time":      ["missing time", "lost time"],
    "implants":          ["implant", "implants", "implanted"],
    "grays":             ["grays", "greys", "gray alien", "grey alien"],
    "reptilian":         ["reptilian", "reptilians"],
    "nordic":            ["nordic", "tall whites", "blonde alien"],
    "mantis":            ["mantis", "mantid", "praying mantis being"],

    # Consciousness / paranormal ──────────────────────────────
    "consciousness":     ["consciousness", "conscious experience"],
    "psi-psychic":       ["psi ", "psychic", "psychics", "telepathy", "telepathic", "remote viewing", "remote viewer"],
    "esp":               ["esp ", "extra sensory", "extrasensory"],
    "near-death":        ["near death", "near-death", "nde", "ndes"],
    "ouf-of-body":       ["out of body", "out-of-body", "obe", "astral projection"],
    "psychedelics":      ["psychedelic", "psychedelics", "dmt", "ayahuasca", "psilocybin", "lsd"],
    "meditation":        ["meditation", "meditative"],
    "synchronicity":     ["synchronicity", "synchronicities"],

    # Physics / propulsion / energy ───────────────────────────
    "antigravity":       ["antigravity", "anti-gravity", "anti gravity"],
    "zero-point":        ["zero point", "zero-point", "zpe"],
    "free-energy":       ["free energy", "overunity", "over-unity"],
    "warp-drive":        ["warp drive", "warp-drive", "alcubierre"],
    "quantum":           ["quantum mechanics", "quantum physics", "quantum entanglement", "quantum field"],
    "relativity":        ["general relativity", "special relativity", "einstein"],
    "casimir":           ["casimir"],
    "metamaterials":     ["metamaterial", "metamaterials"],
    "elements":          ["element 115", "moscovium", "ununpentium"],
    "cold-fusion":       ["cold fusion", "lenr", "low energy nuclear"],
    "tesla":             ["nikola tesla", "tesla coil", "wardenclyffe"],

    # Reverse engineering / craft ─────────────────────────────
    "crash-retrieval":   ["crash retrieval", "crash retrievals", "downed craft", "recovered craft"],
    "reverse-engineering":["reverse engineer", "reverse engineering", "back engineer"],
    "biologics":         ["biologics", "dead pilot", "ebe ", "extraterrestrial biological"],

    # Esoteric / occult ───────────────────────────────────────
    "occult":            ["occult", "occultism", "occultist"],
    "freemasonry":       ["freemason", "freemasonry", "masonic"],
    "gnostic":           ["gnostic", "gnosticism", "demiurge"],
    "kabbalah":          ["kabbalah", "kabbalistic", "qabalah"],
    "alchemy":           ["alchemy", "alchemical", "alchemist"],
    "hermetic":          ["hermetic", "hermeticism", "as above so below"],
    "thelema":           ["thelema", "thelemic", "aleister crowley", "crowley"],
    "process-church":    ["process church"],
    "scientology":       ["scientology", "scientologist", "l. ron hubbard", "hubbard"],

    # Religion / theology ─────────────────────────────────────
    "christianity":      ["christianity", "christian theology", "christian faith"],
    "catholic":          ["catholic church", "catholicism", "the vatican", "vatican"],
    "demonology":        ["demon", "demonic", "demons", "demonology"],
    "angels":            ["angels", "angelic", "fallen angels"],
    "nephilim":          ["nephilim", "watchers", "book of enoch", "enochian"],
    "giants":            ["giant ", "giants", "giant skeleton"],

    # Mythology / ancient ─────────────────────────────────────
    "ancient-egypt":     ["ancient egypt", "egyptian", "pyramids of giza", "pyramid", "pyramids", "great pyramid", "khufu", "hieroglyph"],
    "atlantis":          ["atlantis", "atlantean"],
    "sumeria":           ["sumeria", "sumerian", "anunnaki", "anu "],
    "vedic":             ["vedic", "vimana", "mahabharata", "bhagavad"],
    "mesoamerica":       ["mayan", "aztec", "olmec", "inca", "teotihuacan", "tikal"],
    "stonehenge":        ["stonehenge", "megalithic", "gobekli", "göbekli", "gobeklitepe"],

    # Cryptids / fortean ──────────────────────────────────────
    "bigfoot":           ["bigfoot", "sasquatch"],
    "mothman":           ["mothman"],
    "djinn":             ["djinn", "jinn"],
    "fae":               [" fae ", "fairies", "fairy folk", "fey"],

    # Mind control / programs ─────────────────────────────────
    "mk-ultra":          ["mk ultra", "mk-ultra", "mkultra", "mk-naomi", "mk naomi"],
    "monarch":           ["monarch programming", "monarch program"],
    "remote-viewing":    ["stargate project", "grill flame", "ingo swann", "pat price"],
    "hypnosis":          ["hypnosis", "hypnotic regression", "hypnotic"],

    # Geopolitics / power ─────────────────────────────────────
    "deep-state":        ["deep state", "shadow government", "secret government"],
    "epstein":           ["epstein", "ghislaine"],
    "jfk":               ["jfk", "kennedy assassination", "john f kennedy"],
    "9-11":              ["9/11", "9-11", "september 11", "world trade center"],
    "wwii":              ["world war ii", "world war 2", "wwii", "nazi germany", "third reich"],
    "nazi-paperclip":    ["operation paperclip", "paperclip", "von braun"],
    "cold-war":          ["cold war", "soviet union", "kgb"],
    "china":             ["chinese government", "ccp ", "communist china"],

    # Biology / health / fringe medicine ──────────────────────
    "longevity":         ["longevity", "life extension", "anti-aging", "anti aging"],
    "biotech":           ["biotech", "biotechnology", "gain of function", "gain-of-function"],
    "covid":             ["covid", "sars-cov", "coronavirus"],
    "vaccines":          ["vaccine", "vaccination", "mrna"],
    "fasting":           ["fasting", "intermittent fasting", "ketosis"],

    # Frontier / tech / AI ────────────────────────────────────
    "ai":                ["artificial intelligence", "machine learning", "neural network", "llm ", "large language model"],
    "crypto":            ["bitcoin", "ethereum", "cryptocurrency", "satoshi"],
    "spacex":            ["spacex", "elon musk", "musk"],
    "psychology":        ["jungian", "carl jung", "archetype", "archetypal", "shadow self"],
}


# ─────────────────────────────────────────────────────────────
# Person entities — capitalized name allowlist seeded from
# manifest titles + a known cast of recurring guests. Names
# must be at least two whitespace-separated capitalized tokens.
# ─────────────────────────────────────────────────────────────

KNOWN_PEOPLE = [
    # Hosts / recurring
    "Jesse Michels",
    # Researchers / authors / scientists
    "Bob Lazar", "Hal Puthoff", "Eric Davis", "Jacques Vallée", "Jacques Vallee",
    "John Mack", "J. Allen Hynek", "Allen Hynek", "Stanton Friedman",
    "Diana Walsh Pasulka", "D.W. Pasulka", "Diana Pasulka",
    "Garry Nolan", "Gary Nolan", "Avi Loeb", "Eric Weinstein", "Bret Weinstein",
    "Lex Fridman", "Joe Rogan",
    "Christopher Mellon", "Chris Mellon", "Lue Elizondo", "Luis Elizondo",
    "David Grusch", "Ross Coulthart", "George Knapp", "Tim Taylor",
    "Travis Taylor", "James Fox", "Steven Greer", "Greer",
    "Tom DeLonge", "Tim Alberino", "Whitley Strieber",
    "Jeffrey Mishlove", "Russell Targ", "Hal Putoff",
    "Ingo Swann", "Pat Price", "Joe McMoneagle",
    "Jack Parsons", "L. Ron Hubbard", "Aleister Crowley",
    "Stanley Kubrick", "Carl Jung", "Sigmund Freud",
    "Wernher von Braun", "Albert Einstein", "Nikola Tesla",
    "Robert Bigelow", "Bob Bigelow", "Harry Reid",
    "Marco Rubio", "Anna Paulina Luna", "Tim Burchett", "Eric Burlison",
    "Karl Nell", "Kirk McConnell",
    "Jeffrey Epstein", "Bill Clinton", "Donald Trump", "Joe Biden",
    "Skip Atwater", "Edgar Mitchell", "Buzz Aldrin",
    "Garrett McNamara", "Tero Isokauppila", "Tyler Cowen",
    "Lloyd Pye", "Erich von Däniken", "Graham Hancock",
    "Joscha Bach", "Donald Hoffman", "Bernardo Kastrup", "Federico Faggin",
    "Rupert Sheldrake", "Dean Radin",
    "Skinwalker Tom", "Tom Brown",
    "Jim Semivan", "Hal Bidlack",
    "Curt Jaimungal", "Curt Jaimungal",
    "Danny Sheehan", "Daniel Sheehan",
    "Garry Schoeffler",
    "Anjali Sareen Nowakowski",
    "Travis Walton",
    "Phil Schneider",
    "Richard Doty", "Rick Doty",
    "Paul Hellyer",
    "Edgar Cayce",
    "Manly P. Hall", "Manly Hall",
    "Carl Sagan",
    "Richard Feynman",
    "Robert Anton Wilson",
    "Terence McKenna", "Dennis McKenna",
    "John Keel",
    "Ben Goertzel",
    "Jordan Peterson",
    "Andrew Tate",
    "Peter Thiel",
    "Marc Andreessen",
    "Sam Altman",
]


STOPWORDS = set("""
the a an and or but if then else for of to in on at by with as is are was were be been being
this that these those it its from into about over under after before above below across through
he she they we you i him her them us your his their our my me mine yours theirs ours hers
do does did done has have had not no yes so very too just only also more most some any many few
much such other own same than can could should would will shall may might must out up down off on
""".split())


def parse_transcript(path: Path):
    """Return dict with body text + timestamp list of (sec, text)."""
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    # Title is first line after "# "
    title = ""
    meta = {}
    for ln in lines[:8]:
        if ln.startswith("# "):
            title = ln[2:].strip()
        m = re.match(r"^- (.+?): (.+)$", ln)
        if m:
            meta[m.group(1).strip().lower()] = m.group(2).strip()

    # Timestamps look like:  [00:00:03.600] text...
    paras = []
    ts_re = re.compile(r"^\[(\d{2}):(\d{2}):(\d{2})\.(\d+)\]\s*(.*)$")
    for ln in lines:
        m = ts_re.match(ln)
        if m:
            h, mi, s = int(m.group(1)), int(m.group(2)), int(m.group(3))
            sec = h * 3600 + mi * 60 + s
            body = m.group(5).strip()
            if body:
                paras.append((sec, body))
    full_body = "\n".join(p[1] for p in paras)
    return {
        "title": title,
        "meta": meta,
        "paras": paras,
        "body": full_body,
        "body_lower": full_body.lower(),
    }


def topic_hits(body_lower: str, paras):
    """For each topic, count occurrences in lowercased body and collect timestamped excerpts."""
    out = {}
    for topic_id, patterns in TOPICS.items():
        # Build a single regex per topic
        regex = re.compile(r"\b(" + "|".join(re.escape(p.strip()) for p in patterns) + r")\b", re.IGNORECASE)
        # Count in body
        all_matches = regex.findall(body_lower)
        if not all_matches:
            continue
        # Collect first few excerpts from paragraphs
        excerpts = []
        for sec, text in paras:
            if regex.search(text.lower()):
                excerpts.append({"t": sec, "text": text})
                if len(excerpts) >= 6:
                    break
        out[topic_id] = {"count": len(all_matches), "excerpts": excerpts}
    return out


def person_hits(body: str, paras):
    """Count occurrences of known-person names. Exact (case-sensitive) match for surname pattern."""
    out = {}
    for name in KNOWN_PEOPLE:
        # Match either full name OR last-name-after-first-mention. Keep simple: full name only.
        regex = re.compile(r"\b" + re.escape(name) + r"\b", re.IGNORECASE)
        matches = regex.findall(body)
        if not matches:
            continue
        excerpts = []
        for sec, text in paras:
            if regex.search(text):
                excerpts.append({"t": sec, "text": text})
                if len(excerpts) >= 4:
                    break
        out[name] = {"count": len(matches), "excerpts": excerpts}
    return out


def slugify(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def deterministic_3d_layout(vectors: np.ndarray, scale: float = 200.0):
    """SVD-based 3D projection. Returns (N,3) array."""
    if vectors.shape[0] < 2:
        return np.zeros((vectors.shape[0], 3))
    X = vectors - vectors.mean(axis=0, keepdims=True)
    # Truncated SVD to 3 components
    U, S, Vt = np.linalg.svd(X, full_matrices=False)
    coords = U[:, :3] * S[:3]
    # Normalize each axis to [-scale, scale]
    for i in range(coords.shape[1]):
        col = coords[:, i]
        mn, mx = col.min(), col.max()
        if mx - mn > 1e-9:
            coords[:, i] = (col - mn) / (mx - mn) * 2 * scale - scale
        else:
            coords[:, i] = 0.0
    return coords


def kmeans_simple(X: np.ndarray, k: int, seed: int = 42, max_iter: int = 100):
    """Tiny deterministic k-means."""
    rng = np.random.default_rng(seed)
    n = X.shape[0]
    # Init: k-means++ light — pick first random then farthest
    idx = [int(rng.integers(0, n))]
    for _ in range(k - 1):
        d = np.min(np.linalg.norm(X[:, None, :] - X[idx][None, :, :], axis=2), axis=1)
        idx.append(int(np.argmax(d)))
    centers = X[idx].copy()
    labels = np.zeros(n, dtype=int)
    for _ in range(max_iter):
        d = np.linalg.norm(X[:, None, :] - centers[None, :, :], axis=2)
        new_labels = np.argmin(d, axis=1)
        if np.array_equal(new_labels, labels):
            break
        labels = new_labels
        for c in range(k):
            members = X[labels == c]
            if len(members) > 0:
                centers[c] = members.mean(axis=0)
    return labels, centers


def main():
    transcripts = sorted(TRANSCRIPT_DIR.glob("*.md"))
    print(f"[ingest] {len(transcripts)} transcript files")

    manifest = json.loads(MANIFEST.read_text())
    missing = json.loads(MISSING.read_text())
    # Build manifest lookup by transcript_file
    manifest_by_file = {m["transcript_file"]: m for m in manifest if m.get("transcript_file")}

    episodes = []
    topic_co_doc = defaultdict(set)   # topic_id -> set(episode_idx)
    person_co_doc = defaultdict(set)  # person   -> set(episode_idx)

    for ep_idx, path in enumerate(transcripts):
        parsed = parse_transcript(path)
        meta = manifest_by_file.get(path.name, {})
        topics = topic_hits(parsed["body_lower"], parsed["paras"])
        people = person_hits(parsed["body"], parsed["paras"])
        for tid in topics:
            topic_co_doc[tid].add(ep_idx)
        for p in people:
            person_co_doc[p].add(ep_idx)
        ep = {
            "idx": ep_idx,
            "id": f"ep-{meta.get('playlist_index', ep_idx+1):03d}",
            "playlist_index": meta.get("playlist_index"),
            "title": parsed["title"] or meta.get("title", path.stem),
            "video_id": meta.get("video_id", ""),
            "url": meta.get("url", ""),
            "duration": meta.get("duration", ""),
            "channel": parsed["meta"].get("channel", "Jesse Michels"),
            "filename": path.name,
            "paragraph_count": meta.get("paragraph_count", len(parsed["paras"])),
            "topics": topics,
            "people": people,
            "first_paras": [
                {"t": sec, "text": text}
                for sec, text in parsed["paras"][:3]
            ],
        }
        episodes.append(ep)
        if (ep_idx + 1) % 20 == 0:
            print(f"  [parsed] {ep_idx+1}/{len(transcripts)}")

    n_eps = len(episodes)
    print(f"[topics] {len(topic_co_doc)} topics found")
    print(f"[people] {len(person_co_doc)} people found")

    # Sort topics + people by document frequency
    topic_list = sorted(topic_co_doc.items(), key=lambda kv: (-len(kv[1]), kv[0]))
    person_list = sorted(person_co_doc.items(), key=lambda kv: (-len(kv[1]), kv[0]))

    # Keep all topics that appear in >=2 episodes; keep people with >=2 episodes
    topic_list = [t for t in topic_list if len(t[1]) >= 2]
    person_list = [p for p in person_list if len(p[1]) >= 2]
    print(f"[topics] kept {len(topic_list)} (df>=2)")
    print(f"[people] kept {len(person_list)} (df>=2)")

    topic_ids = [t[0] for t in topic_list]
    person_names = [p[0] for p in person_list]

    # ── Build TF-IDF episode×topic matrix for layout + clustering ──
    n_topics = len(topic_ids)
    if n_topics == 0:
        raise RuntimeError("No topics matched — check vocabulary.")
    M = np.zeros((n_eps, n_topics), dtype=float)
    for i, ep in enumerate(episodes):
        total = sum(ep["topics"][t]["count"] for t in ep["topics"] if t in ep["topics"])
        if total == 0:
            continue
        for j, tid in enumerate(topic_ids):
            c = ep["topics"].get(tid, {}).get("count", 0)
            if c > 0:
                M[i, j] = c / total  # TF
    # IDF
    df = (M > 0).sum(axis=0)
    idf = np.log((n_eps + 1) / (df + 1)) + 1
    Mw = M * idf  # TF-IDF
    # Row L2 normalize
    norms = np.linalg.norm(Mw, axis=1, keepdims=True)
    norms[norms < 1e-9] = 1.0
    Mn = Mw / norms

    # ── Episode 3D layouts (3 topologies) ──
    # Distributed: PCA/SVD of topic vectors
    distrib_coords = deterministic_3d_layout(Mn, scale=200.0)

    # Cluster episodes
    K = min(7, max(3, n_eps // 18))
    labels, centers = kmeans_simple(Mn, K, seed=42)
    print(f"[cluster] k={K}, sizes={Counter(labels.tolist())}")

    # Find medoid: episode closest to overall centroid
    overall = Mn.mean(axis=0)
    dists_to_centroid = np.linalg.norm(Mn - overall, axis=1)
    medoid_idx = int(np.argmin(dists_to_centroid))

    # Centralized: place medoid at origin, others on Fibonacci sphere ordered by distance
    central_coords = np.zeros((n_eps, 3))
    order = np.argsort(dists_to_centroid)
    # Skip medoid; place rest on expanding shells
    placed = 0
    for rank, i in enumerate(order):
        if i == medoid_idx:
            central_coords[i] = [0, 0, 0]
            continue
        phi = (1 + 5 ** 0.5) / 2
        k = placed
        y = 1 - (2 * k / max(1, n_eps - 1))
        radius_xy = math.sqrt(max(0, 1 - y * y))
        theta = 2 * math.pi * k / phi
        # radius grows with rank
        r = 60 + 180 * (rank / max(1, n_eps - 1))
        central_coords[i] = [r * radius_xy * math.cos(theta), r * y, r * radius_xy * math.sin(theta)]
        placed += 1

    # Decentralized: cluster hubs + members. Hubs on a circle, members orbit hubs.
    decentral_coords = np.zeros((n_eps, 3))
    # Per-cluster medoid (closest to cluster center)
    cluster_medoids = {}
    for c in range(K):
        members = np.where(labels == c)[0]
        if len(members) == 0:
            continue
        sub = Mn[members]
        ctr = sub.mean(axis=0)
        d = np.linalg.norm(sub - ctr, axis=1)
        cluster_medoids[c] = int(members[np.argmin(d)])
    hub_radius = 180.0
    hubs = list(cluster_medoids.values())
    for c, hub_i in cluster_medoids.items():
        angle = 2 * math.pi * c / max(1, K)
        hx, hz = hub_radius * math.cos(angle), hub_radius * math.sin(angle)
        decentral_coords[hub_i] = [hx, 0, hz]
        members = [i for i in np.where(labels == c)[0] if i != hub_i]
        for j, m in enumerate(members):
            sub_angle = 2 * math.pi * j / max(1, len(members))
            r = 70.0
            decentral_coords[m] = [
                hx + r * math.cos(sub_angle),
                30 * ((j % 5) - 2) / 2.0,
                hz + r * math.sin(sub_angle),
            ]

    # ── Build nodes ──
    nodes = []
    # Cluster naming: top distinguishing topic per cluster
    cluster_names = {}
    for c in range(K):
        members = np.where(labels == c)[0]
        if len(members) == 0:
            cluster_names[c] = f"Cluster {c}"
            continue
        mean_in = Mn[members].mean(axis=0)
        mean_out = Mn[[i for i in range(n_eps) if labels[i] != c]].mean(axis=0) if (labels != c).any() else np.zeros(n_topics)
        delta = mean_in - mean_out
        top_j = int(np.argmax(delta))
        cluster_names[c] = topic_ids[top_j].replace("-", " ").title()
    print("[cluster names]", cluster_names)

    for i, ep in enumerate(episodes):
        # Top topics & people for excerpt panel
        top_topics = sorted(
            [(tid, info["count"]) for tid, info in ep["topics"].items()],
            key=lambda kv: -kv[1],
        )[:12]
        top_people = sorted(
            [(p, info["count"]) for p, info in ep["people"].items()],
            key=lambda kv: -kv[1],
        )[:10]
        # Excerpts: pick up to 3 from highest-count topics
        excerpts = []
        for tid, _ in top_topics[:4]:
            for ex in ep["topics"][tid]["excerpts"][:1]:
                excerpts.append({"topic": tid, "t": ex["t"], "text": ex["text"]})

        nodes.append({
            "id": ep["id"],
            "kind": "episode",
            "name": ep["title"],
            "playlist_index": ep["playlist_index"],
            "video_id": ep["video_id"],
            "url": ep["url"],
            "duration": ep["duration"],
            "channel": ep["channel"],
            "paragraph_count": ep["paragraph_count"],
            "cluster_id": int(labels[i]),
            "cluster_name": cluster_names[int(labels[i])],
            "is_medoid": 1 if i == medoid_idx else 0,
            "is_llm_center": 0,
            "top_topics": [{"id": t, "count": c} for t, c in top_topics],
            "top_people": [{"name": p, "count": c} for p, c in top_people],
            "excerpts": excerpts,
            "first_paras": ep["first_paras"],
            "x_central": float(central_coords[i, 0]),
            "y_central": float(central_coords[i, 1]),
            "z_central": float(central_coords[i, 2]),
            "x_decentral": float(decentral_coords[i, 0]),
            "y_decentral": float(decentral_coords[i, 1]),
            "z_decentral": float(decentral_coords[i, 2]),
            "x_distrib": float(distrib_coords[i, 0]),
            "y_distrib": float(distrib_coords[i, 1]),
            "z_distrib": float(distrib_coords[i, 2]),
        })

    # Topic nodes — placed around the perimeter of the "distributed" view, using mean position of episodes containing them
    topic_nodes = []
    for j, tid in enumerate(topic_ids):
        eps_with = list(topic_co_doc[tid])
        eps_coords = distrib_coords[eps_with]
        mean_pos = eps_coords.mean(axis=0)
        # Push outward from origin
        norm = np.linalg.norm(mean_pos)
        if norm > 1e-6:
            mean_pos = mean_pos / norm * 260.0
        else:
            mean_pos = np.array([0, 0, 260.0])
        # Centralized: a ring of topics at z=0
        c_angle = 2 * math.pi * j / max(1, len(topic_ids))
        c_pos = np.array([260 * math.cos(c_angle), 0, 260 * math.sin(c_angle)])
        # Decentralized: cluster mean
        d_clusters = Counter(int(labels[i]) for i in eps_with)
        majority_c, _ = d_clusters.most_common(1)[0]
        angle = 2 * math.pi * majority_c / max(1, K)
        hx, hz = hub_radius * math.cos(angle), hub_radius * math.sin(angle)
        d_pos = np.array([hx * 1.6, 80, hz * 1.6])
        topic_nodes.append({
            "id": f"topic-{tid}",
            "kind": "topic",
            "name": tid.replace("-", " ").title(),
            "topic_key": tid,
            "episode_count": len(eps_with),
            "cluster_id": majority_c,
            "cluster_name": cluster_names[majority_c],
            "is_medoid": 0,
            "is_llm_center": 0,
            "x_central": float(c_pos[0]), "y_central": float(c_pos[1]), "z_central": float(c_pos[2]),
            "x_decentral": float(d_pos[0]), "y_decentral": float(d_pos[1]), "z_decentral": float(d_pos[2]),
            "x_distrib": float(mean_pos[0]), "y_distrib": float(mean_pos[1]), "z_distrib": float(mean_pos[2]),
        })

    # Person nodes — placed similarly. Limit to top 50 by document frequency to keep graph readable.
    person_nodes = []
    top_people_global = person_names[:60]
    for j, name in enumerate(top_people_global):
        eps_with = list(person_co_doc[name])
        eps_coords = distrib_coords[eps_with]
        mean_pos = eps_coords.mean(axis=0)
        norm = np.linalg.norm(mean_pos)
        if norm > 1e-6:
            mean_pos = mean_pos / norm * 320.0
        else:
            mean_pos = np.array([0, 120.0, 0])
        c_angle = 2 * math.pi * j / max(1, len(top_people_global)) + math.pi / 13
        c_pos = np.array([320 * math.cos(c_angle), 60, 320 * math.sin(c_angle)])
        d_clusters = Counter(int(labels[i]) for i in eps_with)
        majority_c, _ = d_clusters.most_common(1)[0]
        angle = 2 * math.pi * majority_c / max(1, K) + math.pi / K
        d_pos = np.array([240 * math.cos(angle), 130, 240 * math.sin(angle)])
        person_nodes.append({
            "id": f"person-{slugify(name)}",
            "kind": "person",
            "name": name,
            "episode_count": len(eps_with),
            "cluster_id": majority_c,
            "cluster_name": cluster_names[majority_c],
            "is_medoid": 0,
            "is_llm_center": 0,
            "x_central": float(c_pos[0]), "y_central": float(c_pos[1]), "z_central": float(c_pos[2]),
            "x_decentral": float(d_pos[0]), "y_decentral": float(d_pos[1]), "z_decentral": float(d_pos[2]),
            "x_distrib": float(mean_pos[0]), "y_distrib": float(mean_pos[1]), "z_distrib": float(mean_pos[2]),
        })

    all_nodes = nodes + topic_nodes + person_nodes
    print(f"[nodes] episodes={len(nodes)} topics={len(topic_nodes)} people={len(person_nodes)} total={len(all_nodes)}")

    # ── Build edges ──
    # Episode ↔ Topic (membership)
    distrib_edges = []
    # Compute episode-episode k-NN edges by topic cosine sim
    K_NN = 5
    sim = Mn @ Mn.T
    np.fill_diagonal(sim, -1)
    for i in range(n_eps):
        top_k = np.argpartition(-sim[i], K_NN)[:K_NN]
        for j in top_k:
            if i < j and sim[i, j] > 0.05:
                distrib_edges.append({
                    "source": episodes[i]["id"],
                    "target": episodes[j]["id"],
                    "weight": float(sim[i, j]),
                    "label_forward": "shares topics",
                    "label_backward": "shares topics",
                    "topology": "distrib",
                    "kind": "episode-episode",
                })

    # Episode↔Topic edges (in distributed only)
    for ep_idx, ep in enumerate(episodes):
        for tid, info in ep["topics"].items():
            if tid not in topic_co_doc or len(topic_co_doc[tid]) < 2:
                continue
            distrib_edges.append({
                "source": ep["id"],
                "target": f"topic-{tid}",
                "weight": float(info["count"]),
                "label_forward": "covers",
                "label_backward": "discussed in",
                "topology": "distrib",
                "kind": "episode-topic",
            })

    # Episode↔Person edges (only top people we kept as nodes)
    person_set = set(top_people_global)
    for ep_idx, ep in enumerate(episodes):
        for name, info in ep["people"].items():
            if name not in person_set:
                continue
            distrib_edges.append({
                "source": ep["id"],
                "target": f"person-{slugify(name)}",
                "weight": float(info["count"]),
                "label_forward": "features",
                "label_backward": "appears in",
                "topology": "distrib",
                "kind": "episode-person",
            })

    # ── Centralized edges: medoid → every episode, plus medoid → topic ring
    central_edges = []
    medoid_id = episodes[medoid_idx]["id"]
    for i, ep in enumerate(episodes):
        if i == medoid_idx:
            continue
        central_edges.append({
            "source": medoid_id,
            "target": ep["id"],
            "weight": 1.0,
            "label_forward": "radiates to",
            "label_backward": "orbits center",
            "topology": "central",
            "kind": "episode-episode",
        })
    # Centralized also connects medoid to top topics for orientation
    for tn in sorted(topic_nodes, key=lambda n: -n["episode_count"])[:18]:
        central_edges.append({
            "source": medoid_id,
            "target": tn["id"],
            "weight": 0.5,
            "label_forward": "covers",
            "label_backward": "anchored in",
            "topology": "central",
            "kind": "episode-topic",
        })

    # ── Decentralized edges: cluster hubs ↔ members, hub ↔ hub
    decentral_edges = []
    hub_ids = []
    for c, hub_i in cluster_medoids.items():
        hub_id = episodes[hub_i]["id"]
        hub_ids.append(hub_id)
        for i in range(n_eps):
            if int(labels[i]) == c and i != hub_i:
                decentral_edges.append({
                    "source": hub_id,
                    "target": episodes[i]["id"],
                    "weight": 1.0,
                    "label_forward": "governs",
                    "label_backward": "belongs to hub",
                    "topology": "decentral",
                    "kind": "episode-episode",
                })
    for a in range(len(hub_ids)):
        for b in range(a + 1, len(hub_ids)):
            decentral_edges.append({
                "source": hub_ids[a],
                "target": hub_ids[b],
                "weight": 1.0,
                "label_forward": "bridges to",
                "label_backward": "bridges to",
                "topology": "decentral",
                "kind": "episode-episode",
            })
    # Decentralized also links each topic node to the hub of its majority cluster
    hub_by_cluster = {c: episodes[h]["id"] for c, h in cluster_medoids.items()}
    for tn in topic_nodes:
        c = tn["cluster_id"]
        if c in hub_by_cluster:
            decentral_edges.append({
                "source": hub_by_cluster[c],
                "target": tn["id"],
                "weight": 0.5,
                "label_forward": "anchors",
                "label_backward": "anchored by",
                "topology": "decentral",
                "kind": "episode-topic",
            })

    print(f"[edges] central={len(central_edges)} decentral={len(decentral_edges)} distrib={len(distrib_edges)}")

    # ── Aggregate topic-level excerpts library (sampling 1–2 per ep with that topic)
    topic_excerpts = {}
    for tid in topic_ids:
        bucket = []
        eps_with = list(topic_co_doc[tid])
        for ep_idx in eps_with[:30]:
            ep = episodes[ep_idx]
            for ex in ep["topics"][tid]["excerpts"][:1]:
                bucket.append({
                    "episode_id": ep["id"],
                    "episode_title": ep["title"],
                    "video_id": ep["video_id"],
                    "t": ex["t"],
                    "text": ex["text"],
                })
        topic_excerpts[tid] = bucket[:24]

    # Build excerpts for people too
    person_excerpts = {}
    for name in top_people_global:
        bucket = []
        eps_with = list(person_co_doc[name])
        for ep_idx in eps_with[:30]:
            ep = episodes[ep_idx]
            for ex in ep["people"][name]["excerpts"][:1]:
                bucket.append({
                    "episode_id": ep["id"],
                    "episode_title": ep["title"],
                    "video_id": ep["video_id"],
                    "t": ex["t"],
                    "text": ex["text"],
                })
        person_excerpts[name] = bucket[:24]

    output = {
        "schema_version": 1,
        "generated_with": "scripts/build_topology.py (deterministic, no LLM)",
        "stats": {
            "episodes": len(nodes),
            "topics": len(topic_nodes),
            "people": len(person_nodes),
            "total_topic_matches": int(sum(t["episode_count"] for t in topic_nodes)),
            "k_clusters": K,
            "k_nn": K_NN,
        },
        "cluster_names": {str(k): v for k, v in cluster_names.items()},
        "topic_vocabulary": {tid: TOPICS[tid] for tid in topic_ids},
        "person_vocabulary": top_people_global,
        "missing": missing,
        "nodes": all_nodes,
        "edges": {
            "central": central_edges,
            "decentral": decentral_edges,
            "distrib": distrib_edges,
        },
        "topic_excerpts": topic_excerpts,
        "person_excerpts": person_excerpts,
        "medoid_id": medoid_id,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(output))
    print(f"[write] {OUT} ({OUT.stat().st_size/1024:.1f} KB)")


if __name__ == "__main__":
    main()
