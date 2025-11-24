# Razorpay Payment Gateway Integration Setup

This guide will help you set up Razorpay payment gateway for the subscription system.

## Prerequisites

1. A Razorpay account (Sign up at https://razorpay.com/)
2. Node.js and npm installed
3. Supabase project set up

## Step 1: Install Razorpay Package

In the backend directory, install the Razorpay package:

```bash
cd backend
npm install razorpay
```

## Step 2: Get Razorpay Credentials

1. Log in to your Razorpay Dashboard (https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Generate API Keys (if not already generated)
4. Copy the **Key ID** and **Key Secret**

## Step 3: Configure Environment Variables

### Frontend (.env)

Add the following to your `.env` file in the root directory:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Backend (backend/.env)

Add the following to your `backend/.env` file:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

**Note:** Replace `your_razorpay_key_id`, `your_razorpay_key_secret`, and `your_razorpay_webhook_secret` with your actual Razorpay credentials.

## Step 4: Set Up Database

Run the Supabase migration to create the subscriptions table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard
# Go to SQL Editor and run the contents of:
# supabase/migrations/20240101000006_create_subscriptions_table.sql
```

## Step 5: Configure Razorpay Webhooks (Optional but Recommended)

Webhooks allow Razorpay to notify your server about payment events.

1. Go to Razorpay Dashboard → **Settings** → **Webhooks**
2. Click **Create New Webhook**
3. Enter your webhook URL: `https://your-domain.com/api/payment/webhook`
4. Select events to listen to:
   - `payment.captured`
   - `payment.failed`
5. Copy the **Webhook Secret** and add it to your `backend/.env` file

## Step 6: Test the Integration

### Test Mode

Razorpay provides test credentials for development:

1. Use **Test Mode** in Razorpay Dashboard
2. Use test card details for payments:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date

### Test Payment Flow

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start your frontend:
   ```bash
   npm run dev
   ```

3. Navigate to `/pricing` page
4. Click on any **Purchase** button
5. Complete the payment using test card details
6. Verify the subscription is created in Supabase

## Step 7: Go Live

When ready for production:

1. Switch to **Live Mode** in Razorpay Dashboard
2. Generate new **Live API Keys**
3. Update your environment variables with live credentials
4. Update webhook URL to production domain
5. Test thoroughly before launching

## Payment Flow

1. User clicks **Purchase** button on pricing page
2. Frontend calls backend to create Razorpay order
3. Razorpay checkout modal opens
4. User completes payment
5. Payment response is verified on backend
6. Subscription is saved to database
7. User is redirected to dashboard

## Security Best Practices

1. **Never expose** `RAZORPAY_KEY_SECRET` in frontend code
2. Always verify payment signatures on the backend
3. Use HTTPS in production
4. Implement rate limiting on payment endpoints
5. Log all payment transactions for audit
6. Set up webhook signature verification

## Troubleshooting

### Payment not processing
- Check if Razorpay script is loaded (check browser console)
- Verify API keys are correct
- Check backend logs for errors

### Webhook not working
- Verify webhook URL is accessible from internet
- Check webhook secret is correct
- Ensure webhook endpoint is not behind authentication

### Database errors
- Verify subscriptions table exists
- Check RLS policies are set correctly
- Ensure user is authenticated

## Support

For Razorpay-specific issues:
- Documentation: https://razorpay.com/docs/
- Support: https://razorpay.com/support/

For application issues:
- Check backend logs
- Check browser console
- Verify environment variables are set correctly

