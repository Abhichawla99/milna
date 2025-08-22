# 🤖 Floral AI Agent - Embedded Chat Widget

A beautiful, modern AI chat widget that can be easily embedded on any website. Features smooth animations, responsive design, and seamless integration with your AI agents.

## ✨ Features

- **🎨 Beautiful Design**: Modern, sleek interface with smooth animations
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Lightweight**: Fast loading with no external dependencies
- **🔧 Customizable**: Easy to customize colors, position, and branding
- **🔄 Real-time**: Instant messaging with typing indicators
- **🎯 Smart Positioning**: Choose from 4 corner positions
- **🌙 Theme Support**: Light and dark theme options
- **🔒 Secure**: Direct communication with your AI agent

## 🚀 Quick Start

### 1. Basic Integration

Add this single line to your HTML:

```html
<script src="https://yourdomain.com/embed-agent.js"></script>
```

That's it! The AI chat widget will automatically appear on your website.

### 2. Customization

Edit the configuration in the embed script:

```javascript
const config = {
  agentUrl: 'https://your-agent-url.com',
  agentName: 'Your AI Assistant',
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  theme: 'light', // light, dark
  primaryColor: '#3b82f6', // Blue
  secondaryColor: '#8b5cf6' // Purple
};
```

## 📋 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `agentUrl` | string | - | Your AI agent's webhook URL |
| `agentName` | string | 'AI Assistant' | Display name for your agent |
| `position` | string | 'bottom-right' | Widget position on screen |
| `theme` | string | 'light' | Color theme (light/dark) |
| `primaryColor` | string | '#3b82f6' | Primary brand color |
| `secondaryColor` | string | '#8b5cf6' | Secondary brand color |

### Position Options
- `bottom-right` - Bottom right corner (default)
- `bottom-left` - Bottom left corner
- `top-right` - Top right corner
- `top-left` - Top left corner

### Theme Options
- `light` - Light theme with white background
- `dark` - Dark theme with dark background

## 🎨 Customization Examples

### Different Position
```javascript
const config = {
  agentUrl: 'https://your-agent-url.com',
  position: 'bottom-left', // Changed position
  agentName: 'Support Bot'
};
```

### Dark Theme
```javascript
const config = {
  agentUrl: 'https://your-agent-url.com',
  theme: 'dark', // Dark theme
  primaryColor: '#6366f1',
  secondaryColor: '#a855f7'
};
```

### Custom Colors
```javascript
const config = {
  agentUrl: 'https://your-agent-url.com',
  primaryColor: '#ef4444', // Red
  secondaryColor: '#f97316' // Orange
};
```

## 📱 Mobile Responsive

The widget automatically adapts to mobile devices:
- Full-width chat on mobile screens
- Optimized touch interactions
- Responsive positioning
- Mobile-friendly input handling

## 🔧 Advanced Usage

### React Component Integration

For React applications, you can use the built-in components:

```jsx
import EmbeddedAgent from '@/frontend/components/EmbeddedAgent';
import EmbeddedAgentStandalone from '@/frontend/components/EmbeddedAgentStandalone';

// Inline chat interface
<EmbeddedAgent
  agentUrl="https://your-agent-url.com"
  agentName="Your AI Assistant"
/>

// Floating chat widget
<EmbeddedAgentStandalone
  agentUrl="https://your-agent-url.com"
  agentName="Your AI Assistant"
  position="bottom-right"
  theme="light"
/>
```

### Demo Pages

- **React Demo**: Visit `/embedded-agent-demo` to see the React components in action
- **HTML Demo**: Open `public/embed-demo.html` to see the standalone embed script

## 🎯 User Experience

### Collapsed State
- Floating chat button with AI badge
- Smooth hover animations
- Professional appearance

### Expanded State
- Full chat interface
- Message history
- Typing indicators
- Smooth transitions

### Features
- **Auto-scroll**: Messages automatically scroll to bottom
- **Typing indicators**: Shows when AI is responding
- **Message timestamps**: Each message shows time sent
- **Error handling**: Graceful error messages
- **Loading states**: Visual feedback during API calls

## 🔒 Security & Privacy

- **No data storage**: Messages are not stored on your website
- **Direct communication**: Messages go directly to your AI agent
- **Secure API calls**: Uses standard HTTPS requests
- **No tracking**: No analytics or tracking code included

## 🛠️ Technical Details

### Dependencies
- **None**: Pure JavaScript with no external dependencies
- **CSS-in-JS**: All styles are included in the script
- **Vanilla JS**: Works with any framework or no framework

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **< 10KB**: Lightweight script size
- **< 100ms**: Fast loading time
- **No blocking**: Non-blocking script loading
- **Optimized**: Minimal DOM manipulation

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 to #8b5cf6)
- **Secondary**: Purple accent
- **Success**: Green (#10b981)
- **Background**: White/Light gray
- **Text**: Dark gray (#1f2937)

### Typography
- **Font**: System fonts (San Francisco, Segoe UI, etc.)
- **Sizes**: Responsive text sizing
- **Weights**: Regular (400), Medium (500), Semibold (600)

### Spacing
- **Padding**: 8px, 12px, 16px, 24px
- **Margins**: 8px, 12px, 16px, 24px
- **Border radius**: 8px, 12px, 16px, 20px

## 🚀 Deployment

### 1. Host the Script
Upload `embed-agent.js` to your web server or CDN.

### 2. Update Configuration
Edit the configuration in the script to point to your AI agent.

### 3. Add to Website
Include the script tag in your HTML.

### 4. Test
Verify the widget appears and functions correctly.

## 🔧 Troubleshooting

### Widget Not Appearing
- Check if the script is loaded correctly
- Verify no JavaScript errors in console
- Ensure the script is added before closing `</body>` tag

### Messages Not Sending
- Verify the `agentUrl` is correct
- Check CORS settings on your AI agent
- Ensure the AI agent accepts POST requests

### Styling Issues
- Check for CSS conflicts with your website
- Verify the script is loading completely
- Clear browser cache and reload

## 📞 Support

For support or questions:
- Check the demo pages for examples
- Review the configuration options
- Test with the provided demo files

## 🎉 Examples

### Basic Integration
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to my website</h1>
    <p>Chat with our AI assistant!</p>
    
    <!-- AI Chat Widget -->
    <script src="https://yourdomain.com/embed-agent.js"></script>
</body>
</html>
```

### React Integration
```jsx
import React from 'react';
import EmbeddedAgent from './components/EmbeddedAgent';

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <EmbeddedAgent
        agentUrl="https://your-agent-url.com"
        agentName="My AI Assistant"
      />
    </div>
  );
}
```

---

**Made with ❤️ by Floral AI**
