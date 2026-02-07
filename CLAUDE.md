# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm run dev` - Start development server (http://localhost:3000)
- `pnpm run build` - Build for production
- `pnpm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router pattern with React 19.

### Key Technologies
- **Styling**: Tailwind CSS 4 with shadcn/ui (new-york style, neutral base color)
- **Icons**: Lucide React
- **Utilities**: `cn()` helper in `lib/utils.ts` for merging Tailwind classes

### Path Aliases
- `@/*` maps to project root (e.g., `@/components`, `@/lib/utils`)

### shadcn/ui Configuration
Components are configured via `components.json`:
- Components go in `@/components/ui`
- Hooks go in `@/hooks`
- CSS variables enabled for theming
- Add components with: `npx shadcn@latest add <component>`
