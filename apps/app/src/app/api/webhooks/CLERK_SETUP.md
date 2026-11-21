# Setting Up Clerk Webhooks

This guide walks you through setting up Clerk webhooks to synchronize user data with your Xata database.

## Step 1: Access Webhook Settings in Clerk Dashboard

1. Log in to your [Clerk Dashboard](https://dashboard.clerk.dev/)
2. Select your application
3. Navigate to **Webhooks** from the sidebar menu

![Clerk Dashboard Webhooks Section](https://cdn.clerk.dev/docs/webhooks-section.png)

## Step 2: Create a New Webhook Endpoint

1. Click the **Add Endpoint** button
2. Enter your webhook URL:
   ```
   https://your-domain.com/api/webhooks/xata
   ```
3. For local testing, you can use a service like [ngrok](https://ngrok.com/) to expose your local server:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/xata
   ```

## Step 3: Select Events to Monitor

Select the following events to monitor:

- ✅ `user.created` - When a new user registers
- ✅ `user.updated` - When user profile information changes
- ✅ `user.deleted` - When a user is deleted
- ✅ `email.verified` (optional) - When a user verifies their email

![Clerk Event Selection](https://cdn.clerk.dev/docs/webhook-events.png)

## Step 4: Copy the Webhook Secret

1. After creating the webhook, copy the generated **Signing Secret**
2. Add this secret to your environment variables:
   ```
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

![Clerk Webhook Secret](https://cdn.clerk.dev/docs/webhook-secret.png)

## Step 5: Test the Webhook

1. Click the **Send Test** button in the Clerk Dashboard
2. Select an event type (e.g., `user.created`)
3. Check your server logs to ensure the webhook is received and processed correctly

## Webhook Payload Examples

### User Created Payload

```json
{
  "data": {
    "id": "user_2NZvJ7MSK68nsP6rQzCEYHwlnFA",
    "object": "user",
    "username": null,
    "first_name": "John",
    "last_name": "Doe",
    "email_addresses": [
      {
        "id": "idn_2NZvJ7vZWlgpK0j3dIDgIcMAwwQ",
        "object": "email_address",
        "email_address": "john@example.com",
        "verification": {
          "status": "verified",
          "strategy": "email_code"
        }
      }
    ],
    "primary_email_address_id": "idn_2NZvJ7vZWlgpK0j3dIDgIcMAwwQ",
    "image_url": "https://img.clerk.com/user.jpg",
    "created_at": 1679582241540,
    "updated_at": 1679582241540
  },
  "object": "event",
  "type": "user.created"
}
```

### User Updated Payload

```json
{
  "data": {
    "id": "user_2NZvJ7MSK68nsP6rQzCEYHwlnFA",
    "object": "user",
    "username": null,
    "first_name": "John",
    "last_name": "Smith",
    "email_addresses": [
      {
        "id": "idn_2NZvJ7vZWlgpK0j3dIDgIcMAwwQ",
        "object": "email_address",
        "email_address": "john@example.com",
        "verification": {
          "status": "verified",
          "strategy": "email_code"
        }
      }
    ],
    "primary_email_address_id": "idn_2NZvJ7vZWlgpK0j3dIDgIcMAwwQ",
    "image_url": "https://img.clerk.com/user-updated.jpg",
    "created_at": 1679582241540,
    "updated_at": 1679583241540
  },
  "object": "event",
  "type": "user.updated"
}
```

## Troubleshooting

### Webhook Not Receiving Events

1. Verify your webhook URL is correct and accessible
2. Check that you've selected the correct events to monitor
3. Ensure your `CLERK_WEBHOOK_SECRET` environment variable matches the secret in Clerk

### Server Errors

1. Check your server logs for detailed error messages
2. Verify that your Xata client is properly configured
3. Ensure your database schema matches the expected fields

### Local Development Testing

For local development, consider:

1. Using ngrok to expose your local server
2. Setting up a test environment with a separate Clerk instance
3. Using Clerk's webhook test feature for manual testing

For more information, refer to [Clerk's Webhook Documentation](https://clerk.com/docs/webhooks/overview).