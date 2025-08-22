# Environment Variables for Vercel Deployment

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Supabase Configuration
```
VITE_SUPABASE_URL=https://fapojywavurprfbmeznj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0
```

### N8N Webhook URLs
```
VITE_N8N_CHAT_WEBHOOK=https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat
VITE_N8N_CONTEXT_MANAGER_WEBHOOK=https://abhixchawla.app.n8n.cloud/webhook/contextmanager
VITE_N8N_AGENT_CONFIGURE_WEBHOOK=https://abhixchawla.app.n8n.cloud/webhook/agentconfigure
VITE_N8N_DELETE_DOC_WEBHOOK=https://abhixchawla.app.n8n.cloud/webhook/deletedoc
VITE_N8N_NEW_SITE_USER_WEBHOOK=https://abhixchawla.app.n8n.cloud/webhook/newsiteuser
```

## How to Add Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above with the exact values
5. Make sure to select "Production" environment
6. Redeploy your project

## Local Development

For local development, create a `.env.local` file in your project root with the same variables.
