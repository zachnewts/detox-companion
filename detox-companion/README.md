# Detox Companion

A Next.js web application with AI chat, dashboard, and SMS nudges to support users through 5-7 days of acute opioid withdrawal.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Auth**: Supabase Auth with magic link email authentication
- **AI**: Anthropic Claude API for conversational support
- **SMS**: n8n workflows + Twilio for scheduled nudges

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration from `supabase/migrations/001_initial_schema.sql`
3. Go to Settings > API and copy your Project URL and anon key
4. Go to Authentication > URL Configuration:
   - Set Site URL to `http://localhost:3000`
   - Add `http://localhost:3000/auth/callback` to Redirect URLs

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key

# n8n Webhook Secret
N8N_WEBHOOK_SECRET=your_random_secret_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Authentication**: Magic link email authentication via Supabase
- **Dashboard**: Real-time progress tracking with hour/day counters and milestone visualization
- **Chat Interface**: AI-powered conversational support with full context awareness
- **Motivations**: Users can add and manage their personal "why" statements
- **SMS Nudges**: Scheduled supportive messages via n8n and Twilio

## Manual Setup Steps

### Supabase Database

1. Run the migration SQL in Supabase Dashboard > SQL Editor
2. Verify tables are created in Table Editor
3. Ensure Row Level Security is enabled on all tables

### n8n Workflow

See [N8N_SETUP.md](./N8N_SETUP.md) for detailed instructions on setting up the SMS nudge workflow.

### Production Deployment

1. Push code to GitHub
2. Deploy to Vercel (or your preferred platform)
3. Add all environment variables to your deployment platform
4. Update Supabase redirect URLs to include your production domain
5. Update n8n workflow HTTP Request URL to production endpoint

## Project Structure

```
detox-companion/
├── app/
│   ├── api/              # API routes (chat, nudge)
│   ├── auth/              # Auth callback handler
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Login page
├── components/
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── dashboard/         # Dashboard components
│   ├── motivations/        # Motivations management
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── supabase/          # Supabase client configuration
│   ├── types/             # TypeScript type definitions
│   └── utils/              # Utility functions
└── supabase/
    └── migrations/        # Database migrations
```

## Safety Considerations

The chat system includes medical disclaimers and safety guidelines:
- Explicit "not a doctor" warnings
- Emergency symptom detection prompts
- No medical advice or medication recommendations
- Encouragement to seek professional care for serious symptoms

