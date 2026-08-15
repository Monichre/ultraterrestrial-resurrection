import { getSql } from '@db/postgres'
import type { TestimonyData } from '@/types/testimony'

export async function processTestimony(data: TestimonyData) {
  const sql = getSql()

  try {
    // Check for existing testimony
    const existing = await sql`SELECT id FROM testimonies WHERE title = ${data.title} LIMIT 1`

    if (existing.length > 0) {
      await sql`
        UPDATE testimonies
        SET summary = ${data.summary ?? null},
            description = ${data.context ?? null},
            xata_updatedat = NOW()
        WHERE id = ${existing[0].id}
      `
      return { status: 'updated', id: existing[0].id as string }
    }

    // Create new testimony
    const [testimony] = await sql`
      INSERT INTO testimonies (title, summary, description)
      VALUES (${data.title}, ${data.summary ?? null}, ${data.context ?? null})
      RETURNING id
    `

    if (data.personnel?.length) {
      for (const person of data.personnel) {
        const [kf] = await sql`
          INSERT INTO key_figures (name, role, bio, rank, credibility)
          VALUES (${person.name}, ${person.role ?? null}, ${person.bio ?? null},
                  ${person.authorityMetrics?.rank ?? null}, ${person.authorityMetrics?.credibility ?? null})
          RETURNING id
        `
        await sql`UPDATE testimonies SET witness = ${kf.id}, xata_updatedat = NOW() WHERE id = ${testimony.id}`
      }
    }

    if (data.events?.length) {
      for (const event of data.events) {
        const [ev] = await sql`
          INSERT INTO events (title, description, location, date)
          VALUES (${event.title}, ${event.description ?? null}, ${event.location ?? null},
                  ${event.date ? new Date(event.date) : null})
          RETURNING id
        `
        await sql`UPDATE testimonies SET event = ${ev.id}, xata_updatedat = NOW() WHERE id = ${testimony.id}`
      }
    }

    if (data.organizations?.length) {
      for (const org of data.organizations) {
        const [o] = await sql`
          INSERT INTO organizations (name, description)
          VALUES (${org.name}, ${org.description ?? null})
          RETURNING id
        `
        await sql`UPDATE testimonies SET organization = ${o.id}, xata_updatedat = NOW() WHERE id = ${testimony.id}`
      }
    }

    return { status: 'created', id: testimony.id as string }

  } catch (error) {
    console.error('Error processing testimony:', error)
    throw error
  }
}
