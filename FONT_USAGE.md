# Technologiya - Font Usage Guide

This document outlines how Fira Code, Fira Mono, Menlo, Consolas, and DejaVu Sans Mono are creatively integrated throughout the website.

## Font Variables

```css
--font-mono: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace
--font-display: "Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace
```

## Usage Map

### 🎯 Brand Identity
- **Logo/Brand Name**: Uses `font-display` with tight tracking (-0.03em)
  - Header: "Technologiya"
  - Footer: "Technologiya"
  - Ligatures enabled for a unique tech aesthetic

### 📰 Headlines & Titles
- **H1 (Main Headings)**: `font-display` 
  - Article titles
  - Page titles
  - Hero sections
  
- **H2/H3 (Sub-headings)**: `font-mono`
  - Section headings
  - Category titles
  - Latest news headers

### 🏷️ Badges & Categories
- **Category Badges**: `category-badge` class
  - Uppercase with wide letter-spacing (0.05em)
  - Used on article cards
  - Used on article detail pages
  
### 📊 Numbers & Stats
- **View Counts**: `stat-number` class with tabular-nums
- **Dates**: `meta-info` class with tabular-nums
- **Reading Time**: `meta-info` class
- **Copyright Year**: `font-mono` with tabular-nums

### 🔘 Interactive Elements
- **Navigation Links**: `font-mono` with wide tracking
- **Buttons**: `btn-primary`/`btn-secondary` with `font-mono`
  - "Duba Ƙarin Labarai" (Load More)
  - "Nema" (Search)
  
### 👤 User Info
- **Author Names**: `font-mono`
- **Tags**: `font-mono` with tracking

### 💻 Code & Technical
- All `<code>`, `<pre>`, `<kbd>`, `<samp>` elements use `font-mono`
- Ligatures enabled for better code readability

## Visual Hierarchy

1. **Display Level** (font-display): Main brand, H1 titles
2. **Content Level** (font-mono): H2/H3, navigation, metadata
3. **Body Level** (system fonts): Paragraphs and body text
4. **Technical Level** (font-mono): Code, tags, numbers

## Special Features

### Ligatures
- **Common ligatures**: Enabled globally for natural text flow
- **Discretionary ligatures**: Used for brand name for extra flair
- **No ligatures**: Available via `.ligatures-none` utility class

### Number Formatting
- **Tabular Numbers**: All stats and dates use `tabular-nums` for aligned columns
- Ensures numbers don't shift when updating

### Letter Spacing
- **Brand/Display**: Tight (-0.03em to -0.02em)
- **Navigation**: Wide (0.02em)
- **Categories/Tags**: Extra wide (0.05em for uppercase)

## Examples

### Header Navigation
```tsx
<a className="font-mono text-sm tracking-wide">Wayoyi</a>
```

### Article Title
```tsx
<h1 className="font-display text-4xl tracking-tight">
  Samsung Galaxy S24 Ultra: Bita Cikakke
</h1>
```

### Metadata
```tsx
<span className="meta-info tabular-nums">5 minti karatu</span>
<span className="stat-number tabular-nums">1,250</span>
```

### Category Badge
```tsx
<span className="category-badge tracking-wider">WAYOYI</span>
```

## Design Philosophy

The monospace fonts (Fira Code family) are used strategically to:
1. **Establish Tech Identity**: Gives the site a modern, tech-focused feel
2. **Improve Readability**: Monospace is clear and distinctive for metadata
3. **Create Hierarchy**: Differentiates headings from body content
4. **Enhance Scannability**: Makes numbers and stats easy to spot
5. **Brand Recognition**: Unique typography makes the site memorable

The combination of display monospace for headings and system fonts for body text creates a perfect balance between personality and readability.
