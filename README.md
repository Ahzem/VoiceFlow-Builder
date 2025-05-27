# VoiceFlow Builder

A professional no-code platform for creating voice assistants with Google Calendar integration and VAPI voice technology.

## Features

- **No-Code Voice Assistant Builder**: Create sophisticated voice assistants without technical knowledge
- **Google Calendar Integration**: Seamless appointment scheduling and calendar management
- **Knowledge Base Upload**: Upload business documents and set privacy restrictions
- **Real-Time Voice Testing**: Test your assistant with actual voice interactions
- **Professional UI**: VAPI-inspired design with modern UX practices
- **Multi-Step Wizard**: Guided setup process for easy configuration

## Prerequisites

- Node.js 16+ and npm
- VAPI account and API key
- Google OAuth credentials (already configured)

## Quick Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd VoiceFlow-Builder
   npm install
   ```

2. **Configure VAPI API Key**
   - Get your public key from [VAPI Dashboard](https://dashboard.vapi.ai)
   - Create a `.env` file in the root directory:
   ```
   VITE_VAPI_API_KEY=your_vapi_public_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   - Navigate to `http://localhost:5173`
   - Complete the form wizard to create your first assistant
   - Test voice functionality on the call page

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── forms/           # Form step components
│   └── auth/            # Authentication components
├── pages/
│   ├── Landing.jsx      # Landing page
│   ├── FormWizard.jsx   # Multi-step form
│   ├── CallApp.jsx      # Voice testing interface
│   └── OAuthCallback.jsx # OAuth handler
├── hooks/               # Custom React hooks
├── utils/               # Utilities and API functions
└── styles/              # CSS styling system
```

## Key Technologies

- **React 18+**: Modern React with hooks
- **Vite**: Fast development and build tool
- **VAPI SDK**: Voice AI integration
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Pure CSS**: Custom design system (no frameworks)

## API Integration

- **Webhook URL**: `https://builderbid.app.n8n.cloud/webhook/vapi-create-assistant`
- **Google OAuth**: Configured for calendar integration
- **VAPI**: Real-time voice assistant functionality

## Troubleshooting

### Call Functionality Issues
- Ensure VAPI API key is correctly set in `.env`
- Check browser console for error messages
- Verify microphone permissions are granted
- Confirm assistant ID is valid in VAPI dashboard

### MongoDB Credential Error (n8n)
- Check credential sharing settings in n8n workflow
- Verify MongoDB credential has proper access
- Recreate credential if necessary

### Environment Variables
- Restart dev server after changing `.env`
- Use `VITE_` prefix for frontend environment variables
- Never commit `.env` file to version control

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
