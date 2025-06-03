# VAPI Setup Instructions

## Getting Your VAPI API Key

1. Go to [VAPI Dashboard](https://dashboard.vapi.ai)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Copy your **Public Key** (not the private key)

## Setting Up the Environment Variable

1. Create a `.env` file in the root directory of your project
2. Add the following line to the `.env` file:

```
VITE_VAPI_API_KEY=your_actual_vapi_public_key_here
```

3. Replace `your_actual_vapi_public_key_here` with your actual VAPI public key
4. Save the file and restart your development server

## Important Notes

- Use your **PUBLIC KEY** only (safe for frontend use)
- Never commit your `.env` file to version control
- The `.env` file should be in your `.gitignore`
- Restart your dev server after adding the environment variable

## Testing the Integration

1. Complete the form wizard to create an assistant
2. After Google OAuth, you'll be redirected to the call page
3. Click "Start Call" to test the voice functionality
4. Check the browser console for any VAPI-related errors
5. Verify calls appear in your VAPI dashboard

## Troubleshooting

- If calls don't appear in VAPI dashboard, check your API key
- Ensure your assistant ID is valid
- Check browser console for error messages
- Make sure microphone permissions are granted 