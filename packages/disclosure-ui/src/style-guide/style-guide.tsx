import { ClassificationStamp } from '../components/classification-stamp'
import { SectionHeading } from '../components/section-heading'
import { StatusIndicator } from '../components/status-indicator'
import { TagPill } from '../components/tag-pill'
import { ENTITY_CATEGORY_COLORS, ENTITY_CATEGORY_LABELS } from '../tokens/entity-categories'
import { READING_ROOM_TOKENS } from '../tokens/reading-room'
import { DESIGN_REGISTERS } from '../tokens/registers'
import { RESEARCH_DESK_TOKENS } from '../tokens/research-desk'

import { STYLE_GUIDE_SECTIONS } from './sections'

function TokenSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-8 shrink-0 rounded-sm border border-white/15"
        style={{ background: value }}
        title={value}
      />
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-300">{name}</p>
        <p className="truncate font-mono text-[10px] text-zinc-500">{value}</p>
      </div>
    </div>
  )
}

export function StyleGuide() {
  return (
    <div className="space-y-12 bg-[oklch(0.12_0.02_255)] p-8 text-zinc-200">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[oklch(0.82_0.08_80)]">
          @repo/disclosure-ui
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">Style guide</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
          Canonical tokens and primitives for Ultraterrestrial apps. Two content registers coexist
          on the same surfaces — see docs/vision/DESIGN_REGISTERS.md.
        </p>
      </header>

      <section className="space-y-4">
        <SectionHeading
          title={STYLE_GUIDE_SECTIONS[0].title}
          subtitle={STYLE_GUIDE_SECTIONS[0].description}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {Object.values(DESIGN_REGISTERS).map((register) => (
            <article
              key={register.id}
              data-register={register.id}
              className="rounded-sm border border-white/10 p-4"
            >
              <h2 className="text-sm font-semibold text-zinc-100">{register.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{register.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Reading room tokens"
          subtitle="Archival OKLCH palette for dossiers, stamps, and paper surfaces."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(READING_ROOM_TOKENS).map(([name, value]) => (
            <TokenSwatch key={name} name={name} value={value} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Research desk tokens"
          subtitle="HUD / analytical palette for canvas chrome and entity nodes."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(RESEARCH_DESK_TOKENS).map(([name, value]) => (
            <TokenSwatch key={name} name={name} value={value} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Entity category colors"
          subtitle="Graph and badge colors keyed to Postgres entity types."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(ENTITY_CATEGORY_COLORS).map(([key, value]) => (
            <TokenSwatch
              key={key}
              name={ENTITY_CATEGORY_LABELS[key as keyof typeof ENTITY_CATEGORY_LABELS]}
              value={value}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Primitives"
          subtitle="Shared React components exported from @repo/disclosure-ui/components."
        />
        <div className="flex flex-wrap items-center gap-2">
          <TagPill label="Roswell" variant="bronze" />
          <TagPill label="Event" variant="amber" />
          <TagPill label="Location" variant="teal" />
          <TagPill label="Hypothesis" variant="purple" isActive />
          <ClassificationStamp level="confidential" />
          <ClassificationStamp level="secret" />
          <StatusIndicator label="Synced" tone="live" />
        </div>
      </section>
    </div>
  )
}
