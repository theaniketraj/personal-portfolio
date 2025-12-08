# Personal Portfolio - Aniket Raj

Welcome to the repository for my personal portfolio website. This project serves as my digital identity, showcasing my projects, blog posts, and professional journey. It is designed to be a comprehensive and visually appealing representation of my work and skills.

## 🚀 Overview

This portfolio is built with modern web technologies to ensure high performance, accessibility, and ease of content management. It features a clean, responsive design and a seamless editing experience using Stackbit (Netlify Visual Editor).

## ✨ Features

- **Dynamic Content:** Easily manage pages, blogs, and projects via Markdown and JSON files.
- **Visual Editing:** Integrated with Stackbit for real-time visual editing of content and layout.
- **Responsive Design:** Fully responsive layout built with Tailwind CSS.
- **Performance:** Optimized for speed and SEO using Next.js.
- **Animations:** Smooth transitions and interactions using Framer Motion and React Spring.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v15)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **CMS / Visual Editor:** [Stackbit](https://stackbit.com/)
- **Deployment:** [Netlify](https://www.netlify.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/), [React Spring](https://react-spring.dev/)

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (Node Package Manager)

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

### Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Visual Editor (Stackbit)

To run the project with the Stackbit visual editor locally:

1. **Install the Stackbit CLI (if not already installed):**

   ```bash
   npm install -g @stackbit/cli
   ```

2. **Run the Stackbit dev server:**

   ```bash
   npm run dev:stackbit
   # or
   stackbit dev
   ```

This will output a local URL where you can edit your content visually.

## 📂 Project Structure

```pgsql
personal-portfolio/
├── content/            # Content files (Markdown/JSON) for pages, data, etc.
├── public/             # Static assets (images, fonts, etc.)
├── src/
│   ├── components/     # React components (atoms, molecules, sections, layouts)
│   ├── css/            # Global styles and Tailwind configuration
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Next.js pages and routing
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── stackbit.config.ts  # Stackbit configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── ...
```

## 🚀 Deployment

This project is optimized for deployment on **Netlify**.

1. Connect your repository to Netlify.
2. Configure the build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next` (or let Netlify detect Next.js)
3. Deploy!

## 👤 Author

### **Aniket Raj**

- **Website:** [Portfolio](https://theaniketraj.netlify.app) (CV)
- **GitHub:** [@theaniketraj](https://github.com/theaniketraj)
- **LinkedIn:** [Aniket Raj](https://www.linkedin.com/in/theaniketraj/)

## 📄 License

This project is licensed under the MIT License.
