/**
 * Deterministic record-quality rules.
 *
 * Each rule is a SQL WHERE fragment evaluated against the target table
 * (alias `r`). `{t}` expands to the row alias, `{table}` to the quoted
 * table name. Rules never mutate — they only classify.
 *
 * severity:
 *   blocker — record is unusable / violates an invariant (fix first)
 *   warn    — record is incomplete or disconnected (enrichment target)
 *   info    — thin but functional (fill when convenient)
 */

export type QualitySeverity = 'blocker' | 'warn' | 'info'

export type QualityRule = {
  id: string
  severity: QualitySeverity
  label: string
  /** What an enrichment pass should do about it. */
  fix: string
  where: string
}

export type QualityCatalog = {
  table: string
  /** Column used as the human label in offender listings. */
  labelCol: string
  rules: QualityRule[]
}

// key_figures embedding freshness mirrors packages/db/scripts/rebuild/embed_entities.py:
// hash = md5('text-embedding-3-small|1536|' + strip(cat(name, role, bio)))
// where _cat joins raw values that are non-blank with single spaces.
const KF_EMBED_TEXT = `btrim(concat_ws(' ',
  CASE WHEN {t}.name IS NOT NULL AND btrim({t}.name::text) <> '' THEN {t}.name::text END,
  CASE WHEN {t}.role IS NOT NULL AND btrim({t}.role::text) <> '' THEN {t}.role::text END,
  CASE WHEN {t}.bio  IS NOT NULL AND btrim({t}.bio)  <> '' THEN {t}.bio  END
))`

const KEY_FIGURES: QualityCatalog = {
  table: 'key_figures',
  labelCol: 'name',
  rules: [
    {
      id: 'name_missing',
      severity: 'blocker',
      label: 'name is null or empty',
      fix: 'Supply a canonical name or merge/discard the record.',
      where: `{t}.name IS NULL OR btrim({t}.name::text) = ''`,
    },
    {
      id: 'name_placeholder',
      severity: 'blocker',
      label: 'name looks like a placeholder or stub',
      fix: 'Resolve to a real person or flag for removal review.',
      where: `length(btrim({t}.name::text)) < 3
              OR lower(btrim({t}.name::text)) IN
                 ('unknown','unnamed','anonymous','n/a','na','null','none','test','tbd','?','witness','abductee','contactee')`,
    },
    {
      id: 'name_duplicate',
      severity: 'warn',
      label: 'normalized name collides with another record',
      fix: 'Review pair; merge records or disambiguate name.',
      where: `lower(btrim(regexp_replace({t}.name::text, '\\s+', ' ', 'g'))) IN (
                SELECT lower(btrim(regexp_replace(d.name::text, '\\s+', ' ', 'g')))
                FROM {table} d GROUP BY 1 HAVING count(*) > 1)`,
    },
    {
      id: 'bio_missing',
      severity: 'warn',
      label: 'no bio',
      fix: 'Enrich: 2-3 sentence bio grounded in testimony/document sources.',
      where: `{t}.bio IS NULL OR btrim({t}.bio) = ''`,
    },
    {
      id: 'bio_thin',
      severity: 'info',
      label: 'bio under 60 chars',
      fix: 'Expand bio — current text is a fragment, not a profile.',
      where: `{t}.bio IS NOT NULL AND btrim({t}.bio) <> '' AND length(btrim({t}.bio)) < 60`,
    },
    {
      id: 'role_missing',
      severity: 'warn',
      label: 'no role',
      fix: 'Enrich: role string (e.g. "U.S. Air Force", "Investigative Journalist").',
      where: `{t}.role IS NULL OR btrim({t}.role::text) = ''`,
    },
    {
      id: 'photo_missing',
      severity: 'info',
      label: 'no photo',
      fix: 'Run enrich_key_figure_photos.py (Wikipedia/Commons) → /key-figures/<slug>.<ext>.',
      where: `{t}.photo IS NULL OR cardinality({t}.photo) = 0`,
    },
    {
      id: 'photo_unresolved',
      severity: 'warn',
      label: 'photo holds a dead filename, not a path/URL',
      fix: 'Re-run enrich_key_figure_photos.py — it skips rows whose photo already resolves.',
      where: `{t}.photo IS NOT NULL AND cardinality({t}.photo) > 0
              AND NOT EXISTS (
                SELECT 1 FROM unnest({t}.photo) p
                WHERE p ~ '^(https?://|/)'
              )`,
    },
    {
      id: 'scores_unset',
      severity: 'warn',
      label: 'all four scores unset (0 or null)',
      fix: 'Score rank/credibility/popularity/authority 0-100 via LLM proposal → human confirm.',
      where: `coalesce({t}.rank,0) = 0 AND coalesce({t}.credibility,0) = 0
              AND coalesce({t}.popularity,0) = 0 AND coalesce({t}.authority,0) = 0`,
    },
    {
      id: 'scores_partial',
      severity: 'info',
      label: 'some scores set, others null',
      fix: 'Fill the null score fields alongside any scoring pass.',
      where: `NOT (coalesce({t}.rank,0)=0 AND coalesce({t}.credibility,0)=0
                   AND coalesce({t}.popularity,0)=0 AND coalesce({t}.authority,0)=0)
              AND ({t}.rank IS NULL OR {t}.credibility IS NULL
                   OR {t}.popularity IS NULL OR {t}.authority IS NULL)`,
    },
    {
      id: 'score_out_of_range',
      severity: 'blocker',
      label: 'a score is outside 0-100',
      fix: 'Clamp or rescore — scores drive UI meters.',
      where: `{t}.rank < 0 OR {t}.rank > 100 OR {t}.credibility < 0 OR {t}.credibility > 100
              OR {t}.popularity < 0 OR {t}.popularity > 100 OR {t}.authority < 0 OR {t}.authority > 100`,
    },
    {
      id: 'orphan',
      severity: 'warn',
      label: 'never referenced by any other table',
      fix: 'Link via testimonies/documents/org-members/SME junctions, or review for merge.',
      where: `NOT EXISTS (SELECT 1 FROM testimonies x WHERE x.witness = {t}.id)
              AND NOT EXISTS (SELECT 1 FROM documents x WHERE x.author = {t}.id)
              AND NOT EXISTS (SELECT 1 FROM organization_members x WHERE x.member = {t}.id)
              AND NOT EXISTS (SELECT 1 FROM event_subject_matter_experts x WHERE x.subject_matter_expert = {t}.id)
              AND NOT EXISTS (SELECT 1 FROM topic_subject_matter_experts x WHERE x.subject_matter_expert = {t}.id)
              AND NOT EXISTS (SELECT 1 FROM event_topic_subject_matter_experts x WHERE x.subject_matter_expert = {t}.id)
              AND NOT EXISTS (SELECT 1 FROM user_saved_key_figure x WHERE x.key_figure = {t}.id)`,
    },
    {
      id: 'embedding_stale',
      severity: 'warn',
      label: 'embedding missing or built from older text',
      fix: 'Re-run packages/db/scripts/rebuild/embed_entities.py (no LLM judgment needed).',
      where: `${KF_EMBED_TEXT} <> ''
              AND ({t}.embedding IS NULL
                   OR {t}.embedding_text_hash IS NULL
                   OR {t}.embedding_text_hash <> md5('text-embedding-3-small|1536|' || ${KF_EMBED_TEXT}))`,
    },
  ],
}

export const QUALITY_CATALOGS: Record<string, QualityCatalog> = {
  key_figures: KEY_FIGURES,
}
