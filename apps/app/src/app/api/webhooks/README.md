# Webhooks API

This directory contains webhook endpoints for integrating with external services.

## Available Webhooks

- `/api/webhooks/xata` - Syncs Clerk user data with Xata database

## Clerk Webhook Setup

The Clerk webhook synchronizes user data from Clerk Authentication to our Xata database. When users are created, updated, or deleted in Clerk, this webhook ensures that corresponding records are maintained in our Xata database.

### Configuration Steps

1. **Environment Variables**

   Add the following to your `.env` file:
   ```
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

2. **Clerk Dashboard Setup**

   1. Log in to your [Clerk Dashboard](https://dashboard.clerk.dev/)
   2. Navigate to the **Webhooks** section
   3. Click **Add Endpoint**
   4. Enter the webhook URL: `https://your-domain.com/api/webhooks/xata`
   5. Select the following events to listen for:
      - `user.created`
      - `user.updated`
      - `user.deleted`
      - `email.verified` (optional)
   6. Copy the signing secret and add it to your environment variables as `CLERK_WEBHOOK_SECRET`

3. **Testing the Webhook**

   You can test the webhook using the Clerk Dashboard's **Send Test** feature or by creating/updating a user in your development environment.

### Webhook Functionality

The webhook handles the following events:

- **user.created**: Creates a new user record in Xata
- **user.updated**: Updates an existing user record in Xata
- **user.deleted**: Deletes the corresponding user record from Xata
- **email.verified**: Updates email verification status (if implemented)

### Data Mapping

The following data is synchronized from Clerk to Xata:

| Clerk Field | Xata Field |
|-------------|------------|
| id | external_id |
| email_address | email |
| first_name + last_name | name |
| image_url | profile_image_url |

### Troubleshooting

If the webhook isn't working as expected:

1. Check that the `CLERK_WEBHOOK_SECRET` environment variable is correctly set
2. Verify that the webhook URL in Clerk Dashboard is correct
3. Check server logs for any error messages
4. Ensure the Xata client is properly configured
5. Confirm that the database schema matches the expected fields

For more information on Clerk webhooks, see the [Clerk Webhooks Documentation](https://clerk.com/docs/webhooks/overview).