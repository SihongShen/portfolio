# Terminal-Themed Cyber personal portfolio website

A highly interactive, dual-language personal portfolio built with a strict "electronic archive" terminal aesthetic. Blending retro command-line interfaces with fluid modern web animations.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black.svg?style=flat-square&logo=framer)
![i18n](https://img.shields.io/badge/next--intl-i18n-green.svg?style=flat-square)

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: Tailwind CSS v4, custom CSS variables for programmatic visual states
- **Animation**: Framer Motion (orchestrated layout transitions & micro-interactions)
- **Content System**: `next-mdx-remote` paired with Next.js Server Actions 
- **Internationalization**: `next-intl` (English / 中文 dual-mode)
- **Language**: TypeScript throughout

---

## ✨ Architectural Highlights

### 1. Hybrid Data & Content Bridge (JSON + MDX)
The project employs a dual-layer content management approach:
- **Surface Layer (`src/data/projects.ts`)**: Fast, lightweight structured data used for rendering list views, iterating metadata, and layout logic.
- **Deep Layer (`src/content/projects/[locale]/...mdx`)**: Unstructured Markdown/JSX used for rich documentation. 
- **The Bridge**: Powered by a custom Server Action (`src/app/actions/project.ts`), the client component securely requests and compiles MDX files on-demand without leaking server logic to the browser.
- **Robust Rendering**: Contains a fully overridden `MdxComponents` dictionary mapping standard Markdown (e.g., `<a>`, `<strong>`) to highly stylized, interactive React components (like the cyber-glowing `MdxA` with auto-https prepending).

### 2. The Command-Line Interface (Terminal)
The navigation and core interaction of the site rely on an innovative mock-terminal system:
- Built primarily entirely in React state with an extensible parsing architecture (`src/components/terminal/commands/index.ts`).
- Executes string-based actions like `help`, `about`, `projects`, `clear` converting them into router pushes or UI updates.
- Functions as a persistent floating component globally across the app.

### 3. High-Performance CSS Interaction Hacks
The UI completely avoids heavy WebGL/Three.js overheads for DOM elements, achieving "cyberpunk" visuals using native CSS techniques:
- **Reactive Spotlights**: Tracks mouse coordinates via React `onMouseMove` events (`e.clientX / clientY`), modifying `--mouse-x` and `--mouse-y` CSS variables. Tailwind intercepts these values to render dynamic `radial-gradient` masks that simulate a flashlight panning over the screen.
- **4-Corner Responsive Borders**: Instead of complex clip-paths, bordered components utilize absolute-positioned `w-0` and `h-0` corner elements that transition to `w-full` upon hover, drawing mechanical framing outlines natively in the DOM.

### 4. Internationalization Ecosystem (`next-intl`)
A robust `[locale]` dynamic routing architecture seamlessly tracks and maps users between `en` and `zh`. Translation dictionaries (`src/messages/[locale].json`) inject directly into components, maintaining synchronized layouts and typographies across both languages without duplicating component logic.

---

## 📂 Directory Structure

```text
src/
├── app/
│   ├── [locale]/           # Dynamic i18n Router layer
│   │   ├── about/          # About page 
│   │   ├── projects/       # Projects list and MDX Details modal
│   │   └── page.tsx        # Terminal Home / Entrypoint
│   └── actions/            # Next.js Server Actions (MDX Fetch)
├── components/
│   ├── mdx/                # Custom MDX UI Override mappings
│   ├── terminal/           # The custom command parsing system
│   ├── layout/             # Framer Motion page transitions
│   └── intro/              # Boot sequence & Language selectors
├── content/    
│   └── projects/           # Language-specific .mdx long-form files
│       ├── en/
│       └── zh/
├── data/                   # JSON schemas mapping the portfolio core
├── i18n/                   # next-intl configuration
├── lib/                    # Global utilities
└── messages/               # Key-value dictionary localization sets
```

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.