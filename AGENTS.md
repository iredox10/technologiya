# Technologiya Agent Guidelines

Welcome to the Technologiya project. This is a modern tech news platform built specifically for the Hausa-speaking community.

## 🚀 Tech Stack
- **Framework:** [Astro 5.0+](https://astro.build/) (SSR Mode)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Backend/Auth:** [Appwrite](https://appwrite.io/)
- **State/Data:** Appwrite SDK + Custom Services
- **Content:** Markdown with Highlight.js for code blocks

## 🛠 Commands
- **Development:** `bun run dev`
- **Production Build:** `bun run build`
- **Preview Build:** `bun run preview`
- **Run Utility Scripts:** `bun x tsx <path-to-script>.ts` (e.g., `bun x tsx test-articles.ts`)
- **Astro CLI:** `bun run astro <command>`

## 📁 Project Structure
- `src/components/`: Shared React components. Use PascalCase.
- `src/layouts/`: Astro layouts for shared page structures.
- `src/pages/`: Astro pages (file-based routing).
- `src/lib/`: Appwrite configuration (`appwrite.ts`) and service abstractions (`appwriteServices.ts`).
- `src/types/`: TypeScript interfaces and shared types.
- `src/utils/`: Helper functions (formatting, toasts, markdown parsing).
- `src/styles/`: Global and component-specific CSS (Tailwind 4).

## 🎨 Code Style & Conventions

### 1. TypeScript & Types
- **Strict Typing:** Always use TypeScript. Avoid `any`.
- **Interfaces:** Define models in `src/types/index.ts`.
- **Appwrite Models:** Extend `AppwriteDocument` for database models. Remember that system fields are prefixed with `$` (e.g., `$id`, `$createdAt`, `$updatedAt`).
- **Data Pattern:** Services return a consistent object structure: `{ success: boolean; data?: T; error?: string }`.
- **Generic Types:** Use generics for list responses (e.g., `Models.DocumentList<T>`).

### 2. Imports & Exports
- **Named Exports:** Prefer named exports for functions and types.
- **Default Exports:** Use for React components and Astro layouts.
- **Order:** 
  1. React/Astro built-ins
  2. External libraries (e.g., `appwrite`, `react-icons`)
  3. Internal services/lib (`src/lib/...`)
  4. Components/Layouts (`src/components/...`, `src/layouts/...`)
  5. Types/Utils (`src/types/...`, `src/utils/...`)
  6. Styles (`src/styles/...`)

### 3. React Components
- **Style:** Functional components with Hooks.
- **Interactivity:** Use `client:load` or `client:visible` directives in Astro pages for interactive components.
- **Icons:** Use `react-icons/fi` (Feather Icons) consistently.
- **Toasts:** Use `react-hot-toast` via `src/utils/toast.ts` (e.g., `showSuccessToast('Sako ya tafi')`).
- **Props:** Destructure props in the function signature.

### 4. Astro Pages
- **SSR:** Most pages use `export const prerender = false` for dynamic content.
- **Frontmatter:** Perform data fetching in the frontmatter (`---` block) using `await`.
- **SEO:** Always include `title` and `description` props in layouts.
- **Hydration:** Be explicit about client-side hydration (e.g., `<Component client:load />`).

### 5. Naming Conventions
- **Files:** 
  - Components: `PascalCase.tsx`
  - Layouts: `PascalCase.astro`
  - Pages: `kebab-case.astro` or `[dynamic].astro`
  - Services/Utils: `camelCase.ts`
- **Variables/Functions:** `camelCase`.
- **Constants:** `UPPER_SNAKE_CASE`.
- **Classes:** `PascalCase` (e.g., `ArticleService`).

### 6. Error Handling
- **Graceful Failure:** Use `try...catch` blocks for all async operations.
- **User Feedback:** Use `showErrorToast()` for user-facing errors.
- **Logging:** Use `console.error` with descriptive tags (e.g., `[ArticleService:getArticles] Error: ...`).
- **Response Safety:** Always check `result.success` before accessing `result.data`.

### 7. Language & Localization
- **Language:** The primary language of the UI and content is **Hausa**.
- **Dates:** Use `dayjs` or native `toLocaleDateString('ha-NG')`.
- **UI Strings:** All hardcoded labels must be in Hausa.
  - Examples:
    - "Karanta Labarin" (Read Article)
    - "Bincika" (Search)
    - "Shiga" (Login)
    - "Gida" (Home)
    - "Duba Duka" (View All)
- **Placeholders:** Ensure input placeholders are also in Hausa.

### 8. Appwrite Integration
- **Services:** Centralize database logic in `src/lib/appwriteServices.ts`.
- **Environment:** Use `import.meta.env.PUBLIC_APPWRITE_*` for configuration.
- **Queries:** Use the `Query` utility from `appwrite` for filtering and sorting.
- **Document Pattern:** Enriched documents (with author/category) should be handled in the fetching layer or frontmatter.

### 9. Article Content & Markdown
- **Markdown Support:** Articles use Markdown with GFM support.
- **Syntax Highlighting:** Supported via `highlight.js`. Always specify the language in code blocks (e.g., ` ```javascript `).
- **Code Blocks:** Displayed with a "Kwafi" (Copy) button and language label.
- **Images:** Use descriptive alt text in Hausa.

## 🧪 Testing & Validation
- **Connectivity:** Use standalone scripts (e.g., `test-articles.ts`) to verify backend connectivity: `bun x tsx test-articles.ts`.
- **Build Quality:** Run `bun run build` locally before pushing to ensure no TypeScript or Astro compilation errors.
- **Visuals:** Ensure all images have `alt` tags and use responsive Tailwind classes (`w-full`, `object-cover`, etc.).

## 🎨 Frontend Design Principles
- **Mobile First:** All layouts must be responsive and optimized for mobile devices first.
- **Tailwind 4:** Use utility-first styling. Avoid custom CSS unless necessary (put custom styles in `src/styles/`).
- **Dark Mode:** Support dark mode using the `dark:` prefix. The default theme is light.
- **Consistency:** Use existing components like `ArticleCard`, `HeroBento`, and `CategoryGrid` to maintain visual harmony.
- **Accessibility:** Ensure proper contrast ratios and ARIA attributes where needed.

## 💡 Pro-Tips for Agents
- **Routing:** Check `src/pages/admin/` vs `src/pages/` to distinguish between management and public views.
- **Data Enrichment:** Use the `enrichArticle` helper pattern found in `src/pages/index.astro` when displaying articles with author details.
- **UI Consistency:** Use `HeroBento` or `ArticleCard` for lists. Avoid creating new layout patterns for single articles unless necessary.
- **Responsive Design:** Test with Tailwind's `sm:`, `md:`, `lg:` prefixes.
- **Performance:** Use `client:visible` for components that are below the fold to improve initial load time.
