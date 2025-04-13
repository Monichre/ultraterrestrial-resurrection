import { getXataClient } from '@/db/xata/xata';
import type { TestimonyData } from '@/types/testimony';

export async function processTestimony(data: TestimonyData) {
  const xata = getXataClient();
  
  try {
    // Check for existing testimony
    const existing = await xata.db.testimonies
      .filter({ title: data.title })
      .getFirst();

    if (existing) {
      // Update existing testimony
      await xata.db.testimonies.update(existing.id, {
        summary: data.summary,
        context: data.context,
        claim: data.claims?.join('\n'),
        source: data.source
      });

      return {
        status: 'updated',
        id: existing.id
      };
    }

    // Create new testimony
    const testimony = await xata.db.testimonies.create({
      title: data.title,
      summary: data.summary,
      context: data.context,
      claim: data.claims?.join('\n'),
      source: data.source
    });

    // Process related entities
    if (data.personnel?.length) {
      for (const person of data.personnel) {
        const personnelRecord = await xata.db.personnel.create({
          name: person.name,
          role: person.role,
          bio: person.bio,
          rank: person.authorityMetrics?.rank,
          credibility: person.authorityMetrics?.credibility
        });

        // Link personnel as witness
        await xata.db.testimonies.update(testimony.id, {
          witness: {
            id: personnelRecord.id
          }
        });
      }
    }

    // Process events
    if (data.events?.length) {
      for (const event of data.events) {
        const eventRecord = await xata.db.events.create({
          title: event.title,
          description: event.description,
          location: event.location,
          date: event.date ? new Date(event.date) : undefined
        });

        // Link event to testimony
        await xata.db.testimonies.update(testimony.id, {
          event: {
            id: eventRecord.id
          }
        });
      }
    }

    // Process organizations
    if (data.organizations?.length) {
      for (const org of data.organizations) {
        const orgRecord = await xata.db.organizations.create({
          name: org.name,
          description: org.description
        });

        // Link organization to testimony
        await xata.db.testimonies.update(testimony.id, {
          organization: {
            id: orgRecord.id
          }
        });
      }
    }

    return {
      status: 'created',
      id: testimony.id
    };

  } catch (error) {
    console.error('Error processing testimony:', error);
    throw error;
  }
}