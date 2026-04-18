import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { getXataClient } from '@db/xata/client'

// Initialize the Xata client
const xata = getXataClient()

// Define the event types we care about
type SupportedClerkEvent = 
  | 'user.created' 
  | 'user.updated' 
  | 'user.deleted'
  | 'email.verified' 
  | 'session.created' 
  | 'session.removed'

/**
 * Process Clerk webhooks and sync user data with Xata
 */
export async function POST(req: Request) {
  // Get the Clerk webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not configured')
    return new Response(
      JSON.stringify({ error: 'Webhook secret not configured' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
  
  // Get the headers and body
  const headersList = headers()
  const svix_id = headersList.get('svix-id') || ''
  const svix_timestamp = headersList.get('svix-timestamp') || ''
  const svix_signature = headersList.get('svix-signature') || ''
  
  // If there are no svix headers, this might not be a webhook request
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response(
      JSON.stringify({ error: 'Missing Svix headers' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
  
  try {
    // Get the body
    const payload = await req.text()
    
    // Create a new Webhook instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET)
    
    // Verify the webhook payload
    const evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as { data: any, type: SupportedClerkEvent }
    
    // Process webhook based on event type
    const { id } = evt.data
    const eventType = evt.type
    
    console.log(`Processing webhook: ${eventType} for ID: ${id}`)
    
    switch(eventType) {
      case 'user.created':
        return handleUserCreated(evt.data)
      
      case 'user.updated':
        return handleUserUpdated(evt.data)
      
      case 'user.deleted':
        return handleUserDeleted(evt.data)
      
      case 'email.verified':
        return handleEmailVerified(evt.data)
      
      default:
        // For any other events we're not explicitly handling
        console.log(`Received unhandled event type: ${eventType}`)
        return new Response(
          JSON.stringify({ message: `Event type ${eventType} not handled` }),
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: 'Error processing webhook' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}

/**
 * Handle user creation events from Clerk
 */
async function handleUserCreated(userData: any) {
  try {
    // Check if user already exists in Xata (by external_id)
    const existingUser = await xata.db.users.filter({ 
      external_id: userData.id 
    }).getFirst()
    
    if (existingUser) {
      console.log(`User with external_id ${userData.id} already exists`)
      return new Response(
        JSON.stringify({ message: 'User already exists' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Extract user data from Clerk payload
    const primaryEmailObj = userData.email_addresses?.find(
      (email: any) => email.id === userData.primary_email_address_id
    ) || userData.email_addresses?.[0]
    
    const email = primaryEmailObj?.email_address
    const emailVerified = primaryEmailObj?.verification?.status === 'verified'
    
    // Get name from Clerk data
    const firstName = userData.first_name || ''
    const lastName = userData.last_name || ''
    const username = userData.username || ''
    const name = firstName && lastName 
      ? `${firstName} ${lastName}`
      : username
    
    // Get profile image
    const imageUrl = userData.image_url || ''
    
    // Get public metadata if available
    const metadata = userData.public_metadata || {}
    
    // Create new user in Xata
    const newUser = await xata.db.users.create({
      email,
      name,
      profile_image_url: imageUrl,
      external_id: userData.id,
      // Add additional fields as needed based on your schema
    })
    
    console.log('Created new user in Xata:', newUser.id)
    return new Response(
      JSON.stringify({ message: 'User created successfully', id: newUser.id }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error creating user in Xata:', error)
    return new Response(
      JSON.stringify({ error: 'Error creating user', details: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}

/**
 * Handle user update events from Clerk
 */
async function handleUserUpdated(userData: any) {
  try {
    // Find user by external_id
    const existingUser = await xata.db.users.filter({ 
      external_id: userData.id 
    }).getFirst()
    
    if (!existingUser) {
      console.log(`User with external_id ${userData.id} not found. Creating new user.`)
      return handleUserCreated(userData)
    }

    // Extract user data from Clerk payload
    const primaryEmailObj = userData.email_addresses?.find(
      (email: any) => email.id === userData.primary_email_address_id
    ) || userData.email_addresses?.[0]
    
    const email = primaryEmailObj?.email_address
    
    // Get name from Clerk data
    const firstName = userData.first_name || ''
    const lastName = userData.last_name || ''
    const username = userData.username || ''
    const name = firstName && lastName 
      ? `${firstName} ${lastName}`
      : username
    
    // Get profile image
    const imageUrl = userData.image_url || ''
    
    // Update user in Xata
    await existingUser.update({
      email,
      name,
      profile_image_url: imageUrl,
      // Update additional fields as needed
    })
    
    console.log('Updated user in Xata:', existingUser.id)
    return new Response(
      JSON.stringify({ message: 'User updated successfully', id: existingUser.id }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error updating user in Xata:', error)
    return new Response(
      JSON.stringify({ error: 'Error updating user', details: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}

/**
 * Handle user deletion events from Clerk
 */
async function handleUserDeleted(userData: any) {
  try {
    // Find user by external_id
    const existingUser = await xata.db.users.filter({ 
      external_id: userData.id 
    }).getFirst()
    
    if (!existingUser) {
      console.log(`User with external_id ${userData.id} not found`)
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { 
          status: 200, // Return 200 even when not found for deletion
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Delete user from Xata
    await existingUser.delete()
    
    console.log('Deleted user from Xata:', existingUser.id)
    return new Response(
      JSON.stringify({ message: 'User deleted successfully', id: existingUser.id }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error deleting user from Xata:', error)
    return new Response(
      JSON.stringify({ error: 'Error deleting user', details: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}

/**
 * Handle email verification events from Clerk
 */
async function handleEmailVerified(eventData: any) {
  try {
    const { email_address, user_id } = eventData
    
    // Find user by external_id
    const existingUser = await xata.db.users.filter({ 
      external_id: user_id 
    }).getFirst()
    
    if (!existingUser) {
      console.log(`User with external_id ${user_id} not found`)
      return new Response(
        JSON.stringify({ message: 'User not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update email verified status if needed
    // You might need to add a emailVerified field to your Xata schema
    
    console.log(`Email ${email_address} verified for user: ${existingUser.id}`)
    return new Response(
      JSON.stringify({ message: 'Email verification processed' }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error processing email verification:', error)
    return new Response(
      JSON.stringify({ error: 'Error processing email verification', details: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
}