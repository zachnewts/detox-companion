# n8n Workflow Setup Guide

This guide explains how to set up the n8n workflow for scheduled SMS nudges.

## Prerequisites

- n8n instance (cloud or self-hosted)
- Supabase credentials
- Twilio account with phone number
- Access to your deployed app's nudge API endpoint

## Workflow Steps

### Step 1: Create New Workflow

1. Open your n8n dashboard
2. Create a new workflow named "Detox Companion - Scheduled Nudges"

### Step 2: Add Schedule Trigger Node

- **Type**: Schedule Trigger
- **Settings**:
  - Rule: Every hour
  - Or use Cron: `0 * * * *`

### Step 3: Add Supabase Node

- **Type**: Supabase
- **Operation**: Get Many
- **Table**: `detox_sessions`
- **Filters**: 
  - Column: `status`
  - Operator: `equals`
  - Value: `active`

### Step 4: Add Loop Node

- **Type**: Loop Over Items
- Loop over each active session returned from Supabase

### Step 5: Add Function Node

Add a Function node to calculate if a nudge is needed:

```javascript
// Calculate hours since start
const startTime = new Date($input.item.json.started_at).getTime();
const now = Date.now();
const hoursElapsed = Math.floor((now - startTime) / (1000 * 60 * 60));
const day = Math.floor(hoursElapsed / 24) + 1;

// Determine nudge schedule
let shouldNudge = false;

if (day === 1) {
  // Day 1: Every hour
  shouldNudge = true;
} else if (day === 2 || day === 3) {
  // Days 2-3: Every 4 hours
  shouldNudge = hoursElapsed % 4 === 0;
} else if (day <= 7) {
  // Days 4-7: Every 6 hours
  shouldNudge = hoursElapsed % 6 === 0;
}

return {
  ...items[0].json,
  shouldNudge,
  hoursElapsed,
  day,
};
```

### Step 6: Add IF Node

- **Type**: IF
- **Condition**: `shouldNudge` equals `true`

### Step 7: Add HTTP Request Node

- **Method**: POST
- **URL**: `https://your-app.vercel.app/api/nudge` (or your production URL)
- **Headers**:
  - `Authorization`: `Bearer YOUR_WEBHOOK_SECRET`
  - `Content-Type`: `application/json`
- **Body (JSON)**:
  ```json
  {
    "userId": "{{ $json.user_id }}",
    "sessionId": "{{ $json.id }}"
  }
  ```

### Step 8: Add Twilio Node

- **Type**: Twilio
- **Operation**: Send SMS
- **From**: Your Twilio phone number
- **To**: `{{ $json.phone }}`
- **Message**: `{{ $json.message }} - Check in: https://your-app.vercel.app/dashboard`

### Step 9: Activate Workflow

- Click the "Activate" toggle
- The workflow will now run every hour and send nudges based on the schedule

## Nudge Schedule

- **Day 1**: Every hour
- **Days 2-3**: Every 4 hours
- **Days 4-7**: Every 6 hours

## Environment Variables Needed

Make sure you have these set in your n8n environment:
- Supabase URL and credentials
- Twilio Account SID and Auth Token
- Your app's webhook secret (must match `N8N_WEBHOOK_SECRET` in your app)

