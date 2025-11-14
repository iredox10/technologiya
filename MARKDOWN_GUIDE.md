# Markdown Guide for Technologiya Articles

## ✅ Markdown Support Implemented

Your Technologiya platform now has full markdown support with syntax highlighting for code blocks!

### What's New:

1. **Markdown Parsing** - Automatic conversion of markdown to beautiful HTML
2. **Syntax Highlighting** - 180+ programming languages supported
3. **Code Copy Buttons** - Easy one-click copy for all code blocks
4. **Responsive Design** - Perfect on mobile, tablet, and desktop
5. **Dark Mode Support** - All styles adapt to dark mode
6. **GitHub Flavored Markdown** - Tables, task lists, and more

---

## 📦 Packages Installed

- `marked` - Fast markdown parser
- `highlight.js` - Syntax highlighting for code

---

## 🎨 Supported Languages for Syntax Highlighting

The following languages have full syntax highlighting support:

**Web Development:**
- HTML, CSS, JavaScript, TypeScript
- React (JSX), Vue, Angular
- SCSS, SASS, Less

**Backend:**
- Python, Java, C++, C#, Go, Rust
- PHP, Ruby, Perl
- Node.js

**Data & Scripting:**
- SQL, JSON, YAML, XML
- Bash, PowerShell
- R, MATLAB

**Mobile:**
- Swift, Kotlin, Dart (Flutter)
- Objective-C, Java (Android)

**And 170+ more languages!**

---

## 📝 How to Use Markdown in Articles

### In the Admin/Author Panel:

1. Go to **Create New Article** or **Edit Article**
2. Write your content using markdown syntax
3. Preview will show formatted content
4. Publish - the article will render beautifully!

### Example Article Content:

```markdown
# Yadda Ake Rubuta Code a JavaScript

JavaScript yana ɗaya daga cikin yarukan shirye-shirye mafi shahara a duniya.

## Misali na Code

```javascript
function sayHello(name) {
  console.log(`Hello, ${name}!`);
}

sayHello('Auwal');
\```

## Amfani

- Sauƙi
- Mai ƙarfi
- Ana amfani dashi sosai
```

---

## 🎯 Key Features

### 1. **Copy Code Button**
Every code block has a "Kwafi" (Copy) button that appears on hover. Users can copy code with one click!

### 2. **Language Labels**
Code blocks show the language name in the top-right corner (e.g., "JAVASCRIPT", "PYTHON")

### 3. **Heading Anchors**
All headings have clickable anchors. Hover over a heading to see the # symbol - click to get a shareable link!

### 4. **External Links**
External links automatically open in new tabs with security attributes.

### 5. **Responsive Images**
Images are wrapped in `<figure>` tags with optional captions.

### 6. **Beautiful Tables**
Tables are responsive and styled with proper borders and hover effects.

---

## 🎨 Styling Features

### Code Blocks
- Dark gradient background
- Syntax highlighting with vibrant colors
- Horizontal scrolling for long lines
- Custom scrollbar styling
- Language indicator
- Copy button with feedback

### Inline Code
- Pink/magenta color scheme
- Light background
- Border for definition
- Monospace font with ligatures

### Headings
- Bold and prominent
- Proper spacing
- Anchor links
- H2 has bottom border

### Typography
- Optimized for readability
- Proper line height
- Responsive font sizes
- Dark mode support

---

## 📱 Mobile Optimizations

- Code blocks expand to screen edges on mobile
- Smaller font sizes for better fit
- Copy button always visible on touch devices
- Touch-friendly spacing
- Responsive tables with horizontal scroll

---

## 🌙 Dark Mode

All markdown elements automatically adapt to dark mode:
- Code blocks use darker backgrounds
- Inline code has transparent background
- Syntax highlighting optimized for dark theme
- All colors are theme-aware

---

## 🔧 Technical Implementation

### Files Created/Modified:

1. **`/src/utils/markdown.ts`**
   - Markdown parser with custom renderers
   - Syntax highlighting integration
   - Helper functions

2. **`/src/components/MarkdownContent.tsx`**
   - React component for rendering markdown
   - Copy button functionality
   - Smooth scrolling for anchors

3. **`/src/styles/article.css`**
   - Enhanced code styling
   - Syntax highlighting colors
   - Responsive design
   - Dark mode support

4. **`/src/pages/articles/[slug].astro`**
   - Uses `MarkdownContent` component
   - Renders article content with markdown

---

## 💡 Tips for Authors

### Writing Good Code Blocks:

✅ **DO:**
```markdown
\```javascript
// Always specify the language
function example() {
  return "This will be highlighted!";
}
\```
```

❌ **DON'T:**
```markdown
\```
// No language specified
// Will be plain text
\```
```

### Best Practices:

1. **Always specify language** for code blocks
2. **Add comments** to explain code
3. **Keep code blocks short** (< 50 lines)
4. **Use inline code** for short snippets: `const x = 5;`
5. **Add alt text** to images for accessibility
6. **Use headings** to structure content
7. **Break up long paragraphs** for readability

---

## 🚀 Example Article Template

```markdown
# Title: Yadda Ake Yin X

Gabatarwa game da abin da zaku koyi...

## Abubuwan da Ake Bukata

- Abu 1
- Abu 2
- Abu 3

## Matakin 1: Setup

Fara ta hanyar shigar da kayayyakin:

\```bash
npm install package-name
\```

## Matakin 2: Code

Rubuta code ɗin:

\```javascript
const example = () => {
  console.log("Hello World!");
};
\```

## Kammalawa

Yanzu kun koyi yadda ake...

> **Lura:** Ka tuna ka yi gwaji!
```

---

## 📚 Resources

- **Markdown Guide:** https://www.markdownguide.org/
- **GitHub Flavored Markdown:** https://github.github.com/gfm/
- **Highlight.js Languages:** https://highlightjs.org/static/demo/

---

## ❓ FAQ

**Q: Can I use HTML in markdown?**
A: Yes! You can mix HTML and markdown.

**Q: How do I escape markdown characters?**
A: Use backslash: `\*not italic\*`

**Q: Can I embed videos?**
A: Yes, use HTML `<iframe>` tags.

**Q: What if a language isn't highlighted?**
A: Use 'plaintext' or leave it blank for no highlighting.

---

## 🎉 Conclusion

Your Technologiya platform now has professional markdown support! Write beautiful, well-formatted articles with ease. The syntax highlighting makes code examples clear and easy to read.

Happy writing! 📝✨
