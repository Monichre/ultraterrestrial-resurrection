// Shared shapes for /board activity. The API route builds a snapshot from
// .specstory/history file metadata; the UI only renders what it is given.

export type AgentKind =
  | 'Claude Code'
  | 'Codex CLI'
  | 'Cursor IDE'
  | 'Factory Droid'
  | 'Antigravity'
  | 'Pi'
  | 'Unknown'

/** active < 15 min since last write, recent < 24 h, dormant otherwise. */
export type Recency = 'active' | 'recent' | 'dormant'

export interface SessionActivity {
  /** History file name — stable id. */
  id: string
  agent: AgentKind
  /** Human title from the filename slug (the first words of the prompt). */
  title: string
  /** ISO timestamp parsed from the filename. */
  startedAt: string | null
  /** ISO timestamp of the file's last write (mtime). */
  lastWriteAt: string
  recency: Recency
  /** Ticket IDs named in the session's first user prompt. Not ownership. */
  tickets: string[]
}

export interface ActivitySnapshot {
  /** false when the history directory does not exist (e.g. deployed builds). */
  available: boolean
  generatedAt: string
  /** Total history files on disk, not just the ones returned. */
  totalSessions: number
  /** Newest first, bounded. */
  sessions: SessionActivity[]
}
