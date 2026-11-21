import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { getSql, getUserByExternalId } from '@db/postgres'

// NOTE: route path kept at /api/webhooks/xata for URL stability — it is the
// endpoint registered in the Clerk dashboard. The sync target is Neon Postgres.

// Define the event types we care about
type SupportedClerkEvent =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'email.verified'
  | 'session.created'
  | 'session.removed'

const json = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const extractProfile = (userData: any) => {
  const primaryEmailObj =
    userData.email_addresses?.find(
      (email: any) => email.id === userData.primary_email_address_id
    ) || userData.email_addresses?.[0]

  const email: string | null = primaryEmailObj?.email_address ?? null

  const firstName = userData.first_name || ''
  const lastName = userData.last_name || ''
  const username = userData.username || ''
  const name = firstName && lastName ? `${firstName} ${lastName}` : username || null

  return { email, name }
}

/**
 * Process Clerk webhooks and sync user data with Postgres
 */
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not configured')
    return json({ error: 'Webhook secret not configured' }, 500)
  }

  const headersList = await headers()
  const svix_id = headersList.get('svix-id') || ''
  const svix_timestamp = headersList.get('svix-timestamp') || ''
  const svix_signature = headersList.get('svix-signature') || ''

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return json({ error: 'Missing Svix headers' }, 400)
  }

  try {
    const payload = await req.text()
    const wh = new Webhook(WEBHOOK_SECRET)

    const evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as { data: any; type: SupportedClerkEvent }

    const eventType = evt.type
    console.log(`Processing webhook: ${eventType} for ID: ${evt.data?.id}`)

    switch (eventType) {
      case 'user.created':
      case 'user.updated':
      case 'email.verified':
        return upsertUser(evt.data)

      case 'user.deleted':
        return deleteUser(evt.data)

      default:
        console.log(`Received unhandled event type: ${eventType}`)
        return json({ message: `Event type ${eventType} not handled` }, 200)
    }
  } catch (err) {
    console.error('Error processing webhook:', err)
    return json({ error: 'Error processing webhook' }, 400)
  }
}

/**
 * Create or update the Postgres users row for a Clerk user
 */
async function upsertUser(userData: any) {
  try {
    const externalId: string | undefined = userData?.id
    if (!externalId) {
      return json({ error: 'Missing user id in payload' }, 400)
    }

    const { email, name } = extractProfile(userData)
    const sql = getSql()

    const existingUser = await getUserByExternalId(externalId)

    if (existingUser) {
      await sql`
        UPDATE users
        SET email = ${email}, name = ${name}
        WHERE external_id = ${externalId}
      `
      console.log('Updated user in Postgres:', existingUser.id)
      return json({ message: 'User updated successfully', id: existingUser.id }, 200)
    }

    const id = `user_${crypto.randomUUID()}`
    await sql`
      INSERT INTO users (id, external_id, email, name)
      VALUES (${id}, ${externalId}, ${email}, ${name})
    `
    console.log('Created new user in Postgres:', id)
    return json({ message: 'User created successfully', id }, 201)
  } catch (error) {
    console.error('Error syncing user to Postgres:', error)
    return json({ error: 'Error syncing user', details: (error as Error).message }, 500)
  }
}

/**
 * Delete the Postgres users row for a removed Clerk user
 */
async function deleteUser(userData: any) {
  try {
    const externalId: string | undefined = userData?.id
    if (!externalId) {
      return json({ error: 'Missing user id in payload' }, 400)
    }

    const existingUser = await getUserByExternalId(externalId)

    if (!existingUser) {
      console.log(`User with external_id ${externalId} not found — nothing to delete`)
      return json({ message: 'User not found' }, 200)
    }

    const sql = getSql()
    await sql`DELETE FROM users WHERE external_id = ${externalId}`

    console.log('Deleted user from Postgres:', existingUser.id)
    return json({ message: 'User deleted successfully', id: existingUser.id }, 200)
  } catch (error) {
    console.error('Error deleting user from Postgres:', error)
    return json({ error: 'Error deleting user', details: (error as Error).message }, 500)
  }
}
