# How to Fix Code Block Rendering in Articles

## 🔴 The Problem

When you paste code directly into the article editor, it appears as plain text without syntax highlighting.

**Example of what you have (WRONG):**
```
{
"mcpServers": {
"playwright": {
"command": "npx"
}
}
}
```

This renders as plain text with no colors or formatting.

---

## ✅ The Solution

You need to wrap your code in **markdown code blocks** using triple backticks (```) with the language name.

### Correct Format:

````markdown
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "@nimbus21.ai/chrome-devtools-mcp@latest"
      ]
    },
    "context7": {
      "httpUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "SAKA_API_KEY_DINKA_ANAN",
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}
```
````

---

## 📝 Step-by-Step Instructions

### For New Articles:

1. Go to **Admin/Author Panel** → **Create New Article**
2. Write your content in markdown format
3. For code blocks, use this pattern:

````markdown
Title of your article

Regular text goes here...

```language-name
your code here
```

More text...
````

### For Existing Articles with Plain Code:

1. **Edit the article**
2. Find your plain code block
3. Add three backticks **before** the code: ` ``` `
4. Add the language name right after (e.g., `json`, `javascript`, `python`)
5. Add three backticks **after** the code: ` ``` `

**Before:**
```
{
  "name": "value"
}
```

**After:**
````markdown
```json
{
  "name": "value"
}
```
````

---

## 🎨 Supported Languages

Here are the most common language names to use:

### Web Development:
- `javascript` or `js`
- `typescript` or `ts`
- `html`
- `css`
- `json`

### Backend:
- `python`
- `java`
- `php`
- `go`
- `rust`
- `csharp` or `cs`

### Shell/Terminal:
- `bash` or `sh`
- `powershell`
- `cmd`

### Data:
- `sql`
- `yaml` or `yml`
- `xml`

### Other:
- `markdown` or `md`
- `plaintext` or `text`

---

## 🔧 Your Specific Case

Your JSON config should be formatted like this:

````markdown
# MCP Server Configuration

Here's how to configure your MCP servers:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    },
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "@nimbus21.ai/chrome-devtools-mcp@latest"
      ]
    },
    "context7": {
      "httpUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "SAKA_API_KEY_DINKA_ANAN",
        "Accept": "application/json, text/event-stream"
      }
    }
  }
}
```

## How to Use

1. Copy this configuration
2. Save it to your config file
3. Restart your service

**Important:** Replace `SAKA_API_KEY_DINKA_ANAN` with your actual API key!
````

---

## 💡 Pro Tips

### 1. **Always specify the language**
```javascript  ← Good (will be highlighted)
```              ← Bad (no highlighting)
```

### 2. **Format your JSON properly**
Use a JSON formatter before pasting:
- https://jsonformatter.org/
- Or VS Code's built-in formatter (Alt+Shift+F)

### 3. **Test before publishing**
Use the preview feature in your editor to see how it will look.

### 4. **Keep code blocks short**
If code is too long (>50 lines), consider:
- Breaking it into smaller examples
- Adding comments to explain sections
- Linking to GitHub/Gist for full code

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Missing language name
````markdown
```
{ "name": "value" }
```
````
**Fix:** Add language name
````markdown
```json
{ "name": "value" }
```
````

### ❌ Mistake 2: Using wrong backticks
Don't use single quotes or double quotes:
```
'code here'  ← Wrong
"code here"  ← Wrong
```

Use backticks (the key below Esc):
````markdown
```language
code here
```
````

### ❌ Mistake 3: Not closing the code block
````markdown
```javascript
function example() {
  return true;
}
← Missing closing ```
````

---

## 📋 Quick Reference Card

Copy this template for your articles:

````markdown
# Article Title

Introduction text...

## Section with Code

Here's an example:

```language-name
your code here
```

## Another Section

More content...

```another-language
more code
```

## Conclusion

Final thoughts...
````

---

## 🎯 Quick Fix for Your Article

1. Open your article in edit mode
2. Find this line: ` ```json `
3. Make sure it's **three backticks**, not more, not less
4. Make sure there's NO space before the backticks
5. The code block should look exactly like this:

````
```json
{
  "mcpServers": { ... }
}
```
````

6. Save and view the article
7. You should now see:
   - Colored syntax highlighting
   - "JSON" label in top-right
   - Copy button on hover
   - Beautiful formatting

---

## 🆘 Still Not Working?

If code blocks still don't render properly:

1. **Check the backticks** - They should be ` ``` ` (backtick key, not quotes)
2. **Check the language name** - Should be lowercase, no spaces
3. **Check spacing** - No spaces before opening backticks
4. **Check closing** - Must have closing ` ``` ` after code
5. **Clear cache** - Try Ctrl+F5 to refresh
6. **Check browser console** - Look for JavaScript errors

---

## ✅ Result

When done correctly, your code will have:
- 🎨 Beautiful syntax highlighting
- 📋 One-click copy button
- 🏷️ Language label (e.g., "JSON")
- 🌙 Dark mode support
- 📱 Mobile responsive
- 🎯 Professional appearance

---

**Remember:** The key is the triple backticks (```) with language name!

Happy writing! 📝✨
