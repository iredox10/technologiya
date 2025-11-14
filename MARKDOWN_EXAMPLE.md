# Markdown Example for Technologiya Articles

This is an example of how to use markdown in your articles. Copy and paste this into the article editor.

## Headers

# H1 Heading - Main Title
## H2 Heading - Major Section
### H3 Heading - Subsection
#### H4 Heading - Minor Section
##### H5 Heading
###### H6 Heading

---

## Text Formatting

**Bold text** or __bold text__

*Italic text* or _italic text_

***Bold and italic*** or ___bold and italic___

~~Strikethrough text~~

<mark>Highlighted text</mark>

Subscript: H<sub>2</sub>O

Superscript: X<sup>2</sup>

---

## Links and Images

[Link to Google](https://google.com)

[Link with title](https://google.com "Google Homepage")

![Image Alt Text](https://via.placeholder.com/800x400 "Image Title")

---

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2

### Task List
- [x] Completed task
- [ ] Uncompleted task
- [ ] Another task

---

## Code

### Inline Code
Use `console.log()` to print to the console.

Install with `npm install package-name`

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.

### Code Blocks

JavaScript:
```javascript
// Function to add two numbers
function add(a, b) {
  return a + b;
}

const result = add(5, 3);
console.log(result); // Output: 8
```

Python:
```python
# Function to calculate factorial
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print(f"Factorial: {result}")  # Output: 120
```

HTML:
```html
<!DOCTYPE html>
<html lang="ha">
<head>
    <meta charset="UTF-8">
    <title>Technologiya</title>
</head>
<body>
    <h1>Barka da zuwa Technologiya!</h1>
    <p>Labaran fasaha a Hausa</p>
</body>
</html>
```

CSS:
```css
/* Button styling */
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.button:hover {
  transform: scale(1.05);
}
```

---

## Blockquotes

> This is a simple blockquote.

> This is a blockquote
> that spans multiple lines
> and contains **bold text**.

> **Note:** This is an important note!
> 
> Make sure to read carefully.

---

## Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown | Text formatting | ✅ |
| Code Highlighting | Syntax highlighting | ✅ |
| Images | Image support | ✅ |
| Links | Hyperlinks | ✅ |

### Advanced Table

| Language | Popularity | Use Case |
|:---------|:----------:|----------:|
| JavaScript | ⭐⭐⭐⭐⭐ | Web Development |
| Python | ⭐⭐⭐⭐⭐ | Data Science |
| Java | ⭐⭐⭐⭐ | Enterprise Apps |
| Go | ⭐⭐⭐ | Backend Services |

---

## Horizontal Rules

Three ways to create horizontal rules:

---

***

___

---

## Details/Summary (Collapsible)

<details>
<summary>Click to expand</summary>

This content is hidden by default. Click the summary to reveal it.

You can include:
- Lists
- **Bold text**
- `Code`
- And more!

</details>

---

## Mixed Content Example

Here's a real-world example combining multiple elements:

### Installing Node.js on Windows

1. Visit the official Node.js website: [nodejs.org](https://nodejs.org)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Verify installation:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

> **Important:** Make sure to restart your terminal after installation!

The output should look like this:

```
v20.10.0
10.2.3
```

**Congratulations!** 🎉 You've successfully installed Node.js.

---

## Emoji Support

You can use emojis in your articles:

- 🚀 Rocket
- 💻 Laptop
- 📱 Mobile Phone
- ⚡ Lightning
- 🔥 Fire
- 💡 Light Bulb
- ✅ Check Mark
- ❌ Cross Mark
- 📚 Books
- 🎯 Target

---

## Definition Lists

Term 1
: Definition of term 1

Term 2
: Definition of term 2
: Another definition of term 2

---

## Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: HyperText Markup Language
*[W3C]: World Wide Web Consortium

---

## Best Practices

1. **Use headers hierarchically** - Don't skip levels
2. **Add alt text to images** - For accessibility
3. **Use code blocks for code** - With proper language tags
4. **Keep paragraphs short** - For better readability
5. **Use lists for items** - More scannable than paragraphs

---

## Conclusion

This markdown file demonstrates all the supported formatting options in Technologiya articles. The content will be beautifully rendered with:

- ✅ Syntax highlighting for code
- ✅ Proper typography
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Copy buttons for code blocks

Happy writing! 📝
