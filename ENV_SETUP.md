# Environment Setup

To run this application locally, you need to create a `.env.local` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## How to Get an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in to your OpenAI account
3. Navigate to the API keys section: https://platform.openai.com/api-keys
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

## Important Notes

- Never commit your API key to version control
- Keep track of your API usage as OpenAI services are not free
- The DALL-E 3 model used in this application has associated costs per image generation

## Testing Without an API Key

If you want to test the UI without generating actual images, you can modify the API endpoint in `src/app/api/generate/route.ts` to return a mock image URL for development purposes.
