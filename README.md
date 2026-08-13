<div align="center">
  <br />
  <h1>Aniket Raj - Personal Portfolio & Blog</h1>
  <p>
    <strong>A high-performance, accessible, and beautifully designed personal website built with Next.js 16, React 19, and Tailwind CSS v4.</strong>
  </p>
  <p>
    <a href="https://theaniketraj.netlify.app">View Live Site</a> •
    <a href="https://github.com/theaniketraj/personal-portfolio/issues">Report Bug</a> •
    <a href="https://github.com/theaniketraj/personal-portfolio/issues">Request Feature</a>
  </p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## Overview

Welcome to the source code of my personal portfolio and blog. This project serves as a centralized hub for my professional background, technical projects, and blog articles.

It is engineered from the ground up for **speed**, **accessibility**, and **modern aesthetics** leveraging the latest features from the React and Next.js ecosystems, including the App Router, Server Components, and Turbopack.

## Key Features

- **MDX-Powered Content:** Blogs and Project pages are entirely driven by `.mdx` files with full support for GitHub Flavored Markdown and beautiful syntax highlighting via `rehype-pretty-code` and `shiki`.
- **Dynamic SEO & AI Metadata:** Automatically generates `sitemap.xml`, `robots.txt`, and a dynamic `llms.txt` (a text representation of the portfolio designed specifically for LLMs and AI assistants) at build time.
- **Top-Tier Accessibility (a11y):** Fully keyboard navigable with strict semantic HTML, intelligent focus trapping, explicit ARIA labels, and logical heading hierarchies.
- **Hardware-Accelerated Animations:** Smooth page transitions, entry animations, and interactive micro-interactions powered by CSS hardware acceleration and `framer-motion`.
- **Theme Support:** Clean, beautiful Light and Dark modes with seamless transition toggling.
- **Modern Stack:** Built on the cutting-edge of the web—Next.js 16 (Turbopack), React 19, and Tailwind CSS v4.

## Tech Stack

| Category                | Technologies                             |
| ----------------------- | ---------------------------------------- |
| **Framework**           | Next.js 16.3 (App Router)                |
| **Library**             | React 19                                 |
| **Styling**             | Tailwind CSS v4, `tw-animate-css`        |
| **Content**             | MDX, `gray-matter`, `next-mdx-remote`    |
| **Syntax Highlighting** | `rehype-pretty-code`, `shiki`            |
| **Animations**          | Framer Motion, CSS hardware acceleration |
| **Icons**               | Lucide React, Custom SVGs                |
| **Deployment**          | Netlify                                  |

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher recommended)
- `npm`, `yarn`, or `pnpm`

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/theaniketraj/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   _This uses Turbopack by default for lightning-fast HMR._

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Project Structure

```pgsql
├── blog/ # MDX files for blog posts
├── projects/ # MDX files for project showcase
├── public/ # Static assets (images, icons, fonts)
├── src/
│ ├── app/ # Next.js App Router (pages, layouts, API routes)
│ ├── components/ # Reusable UI components and animations
│ ├── lib/ # Utility functions (MDX parsing, formatting)
│ └── ...
├── next.config.ts # Next.js configuration
├── package.json # Dependencies and scripts
└── README.md # This file
```

## Contact

**Aniket Raj** - Software & AI Engineer

- Website: [Portfolio](https://theaniketraj.netlify.app)
- GitHub: [GitHub](https://github.com/theaniketraj)
- LinkedIn: [LinkedIn](https://www.linkedin.com/in/theaniketraj/)

---
