
import { 
  Calendar, 
  Mail, 
  Database, 
  MessageSquare, 
  Video, 
  Webhook, 
  FolderOpen
} from "lucide-react";

export const AVAILABLE_INTEGRATIONS = [
  {
    type: 'cal_com',
    name: 'Cal.com',
    description: 'Schedule meetings and manage calendar events automatically',
    icon: Calendar,
    defaultConfig: { api_key: '' },
    isAvailable: true
  },
  {
    type: 'google_calendar',
    name: 'Google Calendar',
    description: 'Schedule meetings and manage calendar events automatically',
    icon: Calendar,
    defaultConfig: { calendar_id: '', access_token: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'gmail',
    name: 'Gmail',
    description: 'Send and receive emails with smart responses',
    icon: Mail,
    defaultConfig: { email: '', access_token: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'salesforce',
    name: 'Salesforce CRM',
    description: 'Manage leads and customer data seamlessly',
    icon: Database,
    defaultConfig: { instance_url: '', access_token: '', client_id: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'hubspot',
    name: 'HubSpot CRM',
    description: 'Track deals and manage contacts efficiently',
    icon: Database,
    defaultConfig: { api_key: '', portal_id: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'slack',
    name: 'Slack',
    description: 'Send notifications and updates to your team',
    icon: MessageSquare,
    defaultConfig: { workspace_url: '', bot_token: '', channel_id: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'zoom',
    name: 'Zoom',
    description: 'Create and manage video meetings instantly',
    icon: Video,
    defaultConfig: { api_key: '', api_secret: '', account_id: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'webhook',
    name: 'Custom Webhook',
    description: 'Send data to your custom endpoints and systems',
    icon: Webhook,
    defaultConfig: { url: '', method: 'POST', headers: '{}' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  },
  {
    type: 'google_drive',
    name: 'Google Drive',
    description: 'Access and manage files in your Google Drive',
    icon: FolderOpen,
    defaultConfig: { folder_id: '', access_token: '' },
    expectedDate: 'Q3 2025',
    isAvailable: false
  }
];
