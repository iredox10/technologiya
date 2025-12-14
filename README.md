# Technologiya - Labaran Fasaha a Hausa

A technology news platform in Hausa language, built with Astro and Appwrite.

## Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Appwrite account (for backend services)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/iredox10/technologiya.git
cd technologiya
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your Appwrite credentials

```bash
cp .env.example .env
```

Edit `.env` and add your Appwrite configuration:
- `PUBLIC_APPWRITE_ENDPOINT` - Your Appwrite endpoint URL
- `PUBLIC_APPWRITE_PROJECT_ID` - Your project ID from Appwrite Console
- `PUBLIC_APPWRITE_DATABASE_ID` - Your database ID
- Collection IDs for articles, categories, authors, comments, and users
- Storage bucket IDs for images

## Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

## Building for Production

Build the static site:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Build Notes

- The build process attempts to pre-fetch data from Appwrite during static site generation
- If Appwrite credentials are not configured or the backend is unavailable, you will see connection errors in the build logs
- These errors are expected and do not prevent the build from completing successfully
- Pages will be generated with fallback/empty data when the backend is unavailable
- The build exits with code 0 (success) even when data fetching fails

## Preview Production Build

Preview the built site locally:
```bash
npm run preview
```

## Project Structure

```
technologiya/
├── src/
│   ├── components/     # React components
│   ├── layouts/        # Astro layouts
│   ├── pages/          # Astro pages (routes)
│   ├── lib/            # Appwrite configuration and services
│   ├── styles/         # CSS files
│   └── utils/          # Utility functions
├── public/             # Static assets
├── dist/               # Built static site (generated)
└── astro.config.mjs    # Astro configuration
```

## Technologies Used

- **Astro** - Static site framework
- **React** - UI components
- **Tailwind CSS** - Styling
- **Appwrite** - Backend services (database, storage, authentication)
- **TipTap** - Rich text editor
- **Marked** - Markdown parser
- **Highlight.js** - Code syntax highlighting

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Environment Variables

See `.env.example` for all required environment variables.

### Required Variables:
- Appwrite endpoint and project configuration
- Database and collection IDs
- Storage bucket IDs
- (Optional) Hugging Face API key for TTS features

## Troubleshooting

### Build fails with Appwrite connection errors

This is expected behavior when:
- You haven't configured `.env` file
- Appwrite credentials are invalid
- Appwrite backend is not accessible

**Solution**: The build still completes successfully and generates static files. To fix the warnings:
1. Ensure `.env` file exists with valid Appwrite credentials
2. Verify your Appwrite project is accessible
3. Check that all collection and bucket IDs are correct

### Development server can't connect to Appwrite

Verify:
1. Your `.env` file exists and has correct values
2. Your Appwrite project is active
3. API keys and project ID are correct
4. CORS is configured in Appwrite Console for your development URL

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]
