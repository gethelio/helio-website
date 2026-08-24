# Helio Marketing Website

The website for [Helio](https://www.helio.so), the open-source governance proxy for MCP agents. Helio enforces policy on tool calls before they reach upstream servers, with spend limits, evidence checks, human approvals, tool-drift detection, and a durable audit trail.

This repository contains the marketing site. The Helio product, documentation, and issue tracker live in the [gethelio/helio](https://github.com/gethelio/helio) repository.

## Stack

- [Astro](https://astro.build) 5 with static pages and on-demand API routes
- React for interactive components
- Tailwind CSS
- Astro content collections for the blog
- Astro API routes (Vercel serverless)
- Vitest

## Local development

Node.js 24 is recommended. The project supports Node.js 20 or later.

```sh
nvm use
npm install
cp .env.example .env
npm run dev
```

The development server runs at [http://localhost:4321](http://localhost:4321).

Most pages work without external services. The design-partner form and other server-side integrations require the relevant variables documented in `.env.example`. Do not commit `.env` or service-account credentials.

## Project structure

```text
/
├── public/               # Static images, icons, and metadata files
├── scripts/              # Build and deployment utilities
├── src/
│   ├── components/       # Astro and React UI components
│   ├── content/          # Blog posts and content schemas
│   ├── layouts/          # Shared page layouts
│   ├── lib/              # Forms, services, and shared utilities
│   ├── pages/            # File-based routes (including /api)
│   └── styles/           # Global styles
├── __tests__/            # Vitest test suites
└── astro.config.js
```

Global site metadata is defined in `src/const.ts`. Blog posts live in `src/content/blog`, with their schema in `src/content.config.ts`.

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Type-check and build the production site |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage |
| `npm run astro -- --help` | Show the Astro CLI help |

## Deployment

The site uses Astro's Vercel adapter. Static pages are prerendered; the design-partner API route runs on demand. A production deployment should use:

```sh
npm run build
```

The canonical site URL is configured as `https://www.helio.so` in `astro.config.js`.
