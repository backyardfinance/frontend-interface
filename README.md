# React Vite TypeScript Boilerplate

This is a boilerplate project using **React, Vite, and TypeScript**, preconfigured with **Tailwind CSS, Biome, and Husky** for a smooth development experience.

## Features

- ⚡ **Vite** – Fast development server and production builds.
- ⚛️ **React 19** – Latest version with modern features.
- 🛠 **TypeScript** – Static type checking.
- 🎨 **Tailwind CSS** – Utility-first CSS framework.
- ✅ **Biome** – Fast linting and code formatting.
- 🐶 **Husky & lint-staged** – Pre-commit hooks for better code quality.
- ⚡ **Bun** – Fast package manager and runtime.

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies

Run the following command:

```bash
bun install
```

### 2️⃣ Start Development Server

```bash
bun run dev
```

### 3️⃣ Build for Production

```bash
bun run build
```

## 📦 Available Scripts

- `bun run dev` – Start development server with host access
- `bun run build` – Build for production (includes TypeScript compilation)
- `bun run typecheck` – Run TypeScript type checking
- `bun run lint` – Run type checking and Biome linting with auto-fix
- `bun run format` – Format code with Biome
- `bun run check` – Run Biome check with auto-fix
- `bun run preview` – Preview production build locally

## 🔧 Tech Stack

- **Frontend**: React 19.1.1, TypeScript 5.9.2
- **Build Tool**: Vite 7.1.5
- **Styling**: Tailwind CSS 4.1.13
- **Code Quality**: Biome 2.2.4
- **Package Manager**: Bun
- **Git Hooks**: Husky 9.1.7 + lint-staged

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── layouts/            # Page layouts
├── pages/              # Application pages
├── styles/             # Global styles
└── utils/              # Utility functions
