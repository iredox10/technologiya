# How to Configure MCP Servers

Here's an example configuration for MCP servers:

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

## Installation

To use this configuration, save it to your config file and restart the service.

## Important Notes

- Replace `SAKA_API_KEY_DINKA_ANAN` with your actual API key
- Make sure all dependencies are installed
- Test each server individually before running all together
