# ClickSoora - Free AI Image Generator

ClickSoora is a modern Next.js application that generates and edits stunning AI images using OpenAI's GPT Image 1 model. Built with engaging UI elements, smooth animations, and a responsive design.
[![Watch the video](https://img.youtube.com/vi/v0N4fW-E0qk/maxresdefault.jpg)](https://youtu.be/v0N4fW-E0qk)

<p align="center">
  <a href="https://www.youtube.com/watch?v=v0N4fW-E0qk">
    <img src="https://j.gifs.com/vO0xYX.gif" alt="Video Preview" width="480" height="270"/>
  </a>
</p>

## Features

- Generate high-quality AI images from text descriptions
- Edit and combine existing images with AI assistance
- Modern UI with animated gradients and smooth transitions
- Responsive design for all devices
- Dark/Light mode support
- Free to use and open-source

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **APIs**: OpenAI API (GPT Image 1)
- **Image Processing**: Sharp
- **Theming**: next-themes for dark mode support

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- NPM or Yarn package manager
- OpenAI API key with access to GPT Image 1 model

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/hossamudin/clicksoora.git
   cd clicksoora
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Limitations

- **Maximum Image Size**: 4MB per image
- **Supported Formats**: PNG, JPEG, WebP
- **Component Images**: Up to 9 additional images for editing (plus main image)
- **Transparent Background**: Only available with PNG and WebP formats

## Demo Mode

The application includes a demo mode for showcasing the UI without exposing your OpenAI API key. In demo mode:

- The UI is fully functional
- API calls are intercepted and return sample data
- No actual OpenAI API requests are made

To enable demo mode, set the environment variable:
```
NEXT_PUBLIC_DEMO_MODE=true
```

Demo mode is automatically enabled when no OpenAI API key is provided.

## Deployment

This project can be easily deployed to Netlify or Hostinger:

### Netlify Deployment

This project is configured for easy deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the configuration in `netlify.toml`
3. The site will be deployed in demo mode by default

If you want to deploy a fully functional version (not recommended for public sites):

1. Add your OpenAI API key in the Netlify environment variables
2. Set `NEXT_PUBLIC_DEMO_MODE` to `false`

```
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_DEMO_MODE=false
```

**Security Note:** It's generally not recommended to expose your OpenAI API key in a public deployment, as it could lead to unauthorized usage and charges.

## Project Structure

```
ai-image-generator/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app router files
│   │   ├── api/      # API routes
│   │   └── page.tsx  # Main page component
│   ├── components/   # React components
│   │   ├── layout/   # Layout components
│   │   ├── sections/ # Page sections
│   │   └── ui/       # UI components
│   ├── services/     # Service functions for API calls
│   ├── utils/        # Utility functions
│   └── hooks/        # Custom React hooks
├── .env.local        # Environment variables (create this file)
├── next.config.js    # Next.js configuration
└── tailwind.config.ts # Tailwind CSS configuration
```

## Acknowledgments

- Special thanks to [Alasano](https://github.com/Alasano/gpt-image-1-playground) for their GPT Image 1 implementation which provided valuable insights for our image editing functionality.
- OpenAI for providing the GPT Image 1 API

## License

This project is open-source and available under the MIT License.

## About the Creator

ClickSoora is a free project by Hossamudin Hassan, a Muslim Egyptian entrepreneur and AI content creator helping Arab audiences learn about AI and make the most out of it.

- YouTube: [@ePreneurs](https://www.youtube.com/@ePreneurs)
- Website: [Hossamudin.com](https://hossamudin.com)
- GitHub: [hossamudin](https://github.com/hossamudin)

## Tutorials

- [How to use GPT 4o image generation (Arabic)](https://www.youtube.com/watch?v=ZHo1Q870FnM)
- [How to use ClickSoora (Arabic)](https://youtu.be/zzNoASCoHs0)
- [How to use ClickSoora (English)](https://youtu.be/1c3LDfLlwM0) - Coming Soon
