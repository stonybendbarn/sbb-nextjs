# Order Management Setup Guide

This guide explains how to set up and use the new order management features.

## Features Implemented

1. **Shipping Discount Display**: Shows strikethrough pricing for discounted shipping
2. **Inventory Sold Marking**: Automatically marks items as sold when purchased
3. **Order Confirmation Emails**: Sends confirmation emails to customers
4. **Shipping Notification Emails**: Sends shipping notifications when orders are shipped
5. **Specific Item Tracking**: Tracks which exact database items were purchased

## Setup Instructions

### 1. Database Migration

Run the database migration to create the orders table:

```bash
node scripts/run-migration.js
```

Or manually run the SQL in `lib/migrations/create-orders-table.sql` in your PostgreSQL database.

### 2. Environment Variables

Make sure you have these environment variables set:

```env
# Email configuration (already set up)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_from_email
ORDER_EMAIL=your_order_notification_email

# Shipping discount (new)
NEXT_PUBLIC_SHIPPING_DISCOUNT=20  # 20% off shipping
SHIPPING_DISCOUNT=20  # Server-side shipping discount

# Free shipping threshold
FREE_SHIP_THRESHOLD_CENTS=50000  # $500 for free shipping

# Admin authentication
ADMIN_PASSWORD=your_secure_admin_password_here
ADMIN_SESSION_SECRET=your_random_session_secret_here
```

### 3. Stripe Webhook Configuration

Make sure your Stripe webhook is configured to send `checkout.session.completed` events to:
```
https://yourdomain.com/api/stripe-webhook
```

## How It Works

### Order Flow

1. **Customer Places Order**: Customer goes through Stripe checkout
2. **Webhook Processes Order**: 
   - Marks all purchased items as "Sold" in database
   - Stores order details in `orders` table
   - Sends confirmation email to customer
   - Sends notification email to admin with specific item IDs
3. **Admin Ships Order**: Use admin panel to mark as shipped and send tracking info

### Admin Panel

Access the admin panel at `/admin/orders` to:
- View all orders
- See which specific items were purchased (with database IDs)
- Mark orders as shipped
- Send shipping notifications with tracking numbers

### Email Notifications

**Customer receives:**
- Order confirmation email immediately after purchase
- Shipping notification when you mark order as shipped

**You receive:**
- Admin notification with order details and specific item IDs
- Easy way to see exactly which items were purchased

## Specific Item Tracking

When someone buys "canary coasters" but you have 3 sets, the admin notification will show:
- Item name: "Canary Coasters"
- Database ID: "123" (the specific set that was purchased)
- This lets you know exactly which physical item to ship

## Shipping Discount Display

If `NEXT_PUBLIC_SHIPPING_DISCOUNT` is set, the inventory page will show:
- Original shipping price with strikethrough
- Discounted shipping price in green
- Example: ~~$15.00~~ $12.00 (20% off)

## Troubleshooting

### Orders Not Being Marked as Sold
- Check that Stripe webhook is properly configured
- Verify webhook secret is correct
- Check webhook logs in Stripe dashboard

### Emails Not Sending
- Verify Resend API key is correct
- Check FROM_EMAIL and ORDER_EMAIL are set
- Check email logs in Resend dashboard

### Database Issues
- Ensure PostgreSQL connection is working
- Run the migration script
- Check that the `orders` table was created

## Testing

1. Place a test order through your site
2. Check that items are marked as "Sold" in inventory
3. Verify you receive admin notification email
4. Check that customer receives confirmation email
5. Use admin panel to mark as shipped and send tracking notification
