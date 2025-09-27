# F3 The Capital Landing Pages

A static HTML site for F3 The Capital built with TailwindCSS and designed for deployment on Vercel.

## Pages

- **Home** (`/`) - Main landing page with hero section and mission overview
- **Brothers & Brews** (`/brosandbrews`) - Event landing page for the benefit night
- **Success** (`/success`) - Thank you page after ticket purchase
- **The Capital** (`/capital`) - Local stats and impact stories
- **Join Us** (`/joinus`) - How to join F3 The Capital
- **Partner** (`/partner`) - Sponsorship and partnership opportunities
- **Donor** (`/donor`) - Donor wall and giving information
- **Grow** (`/grow`) - SEO page about transformation from Sad Clown to HIM

## Technology Stack

- **HTML5** - Semantic markup
- **TailwindCSS** - Utility-first CSS framework (via CDN)
- **Vercel** - Static site hosting and deployment
- **JavaScript** - Minimal client-side functionality for navigation

## Project Structure

```
/
├── index.html              # Home page
├── pages/                  # Additional pages
│   ├── brosandbrews.html
│   ├── success.html
│   ├── capital.html
│   ├── joinus.html
│   ├── partner.html
│   ├── donor.html
│   └── grow.html
├── components/             # Shared components
│   ├── nav.html           # Navigation component
│   └── footer.html        # Footer component
├── assets/                # Static assets (images, etc.)
├── package.json           # Node.js dependencies
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally with Vercel:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Deployment

This site is configured for deployment on Vercel:

1. Push your code to a Git repository
2. Connect the repository to Vercel
3. Deploy automatically on every push

## Features

- **Responsive Design** - Mobile-first approach with TailwindCSS
- **SEO Optimized** - Proper meta tags and semantic HTML
- **Fast Loading** - Static HTML with minimal JavaScript
- **Accessible** - ARIA labels and semantic markup
- **Modern UI** - Clean, professional design with F3 branding

## Customization

- Update colors in the Tailwind config within each HTML file
- Modify content directly in the HTML files
- Add new pages by creating HTML files in the `pages/` directory
- Update navigation in `components/nav.html`

## License

MIT License - see LICENSE file for details.
