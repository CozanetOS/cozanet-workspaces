# CozanetOS Workspaces: The AI-Native Multi-Workspace Environment

An integral component of **CozanetOS**—the AI-native operating system designed for frictionless human-agent collaboration.

---

## Overview

CozanetOS Workspaces provides the unified desktop, workspace, and windowing environment for CozanetOS. It serves as the primary multi-modal surface where humans and AI agents work together, offering a highly adaptive, stateful suite of workspaces (browser, code, terminal, visual studio, email, databases) that automatically organize, synchronize, and persist based on the task context.

---

## Core Capabilities

- **Conversation Workspace**: The primary chat and interaction stream where users and AI agents communicate, plan, and dispatch complex system tasks.
- **Browser Workspace**: An embedded, secure web browser fully instrumented for AI agent navigation, scraping, form-filling, and interactive automation.
- **Code Workspace**: A complete IDE-like workspace featuring syntax highlighting, diagnostic language servers, git integration, and real-time AI pair programming.
- **Terminal Workspace**: Integrated, isolated shell environments permitting secure CLI execution with AI command explanation and prompt generation.
- **CX7 Workspace**: The native integration workspace for the CX7 visual studio, allowing users to build visual assets, edit schemas, and preview animations.
- **Email Workspace**: A fully managed workspace for email operations, supporting OAuth-linked Gmail and Outlook inbox sync, filtering, and AI draft generation.
- **Notes Workspace**: Markdown-driven personal knowledge manager equipped with automated semantic categorization, backlinking, and semantic search.
- **Dashboard Workspace**: Real-time operating system diagnostics, active agent execution queues, resource monitors, and audit logs.
- **Database Workspace**: A powerful visual client for browsing, searching, schema-editing, and querying SQL/NoSQL databases with AI query assistance.
- **API Workspace**: A sandbox for testing APIs, exploring schemas, managing keys, and automatically generating robust client SDKs.
- **Workspace Manager**: Robust window layout management enabling fluid workspace switching, resizing, split-screens, docking, and full-screen modes.
- **Adaptive Layout Engine**: Automatically rearranges panels, tools, and sidecars based on the active task and recommendation from operating system agents.
- **Session Persistence**: Captures and persists the precise state, open files, active terminal histories, and browser tabs across operating system restarts.
- **Cross-Workspace Data Sharing**: Seamless drag-and-drop mechanics and shared clipboard contexts permitting data movement (such as files, variables, or code snippets) between workspaces.
- **Workspace Plugin SDK**: Extend the capabilities of any workspace or create entirely custom workspaces utilizing our standard React/Vue workspace SDK.

---

## Architecture & Components

The cozanet-workspaces subsystem utilizes a container-based viewport architecture:
1. **Workspace Hub (Core Window Manager)**: Orchestrates window splits, tab grouping, viewport ratios, and overlay layers.
2. **Workspace Sandboxes**: Each workspace operates in an isolated iframe or web worker context, communicating over a structured, high-speed RPC event bus.
3. **State Sync Broker**: Syncs files, selections, and terminal buffers to local state providers, saving snapshot metadata to the system database for instant session restoration.
4. **Agent Hook Layer**: Provides standardized APIs exposing window states, file buffers, and viewports directly to background agents.

---

## API & Interface Overview

Here is an example of interacting with this module programmatically:

```typescript
import { WorkspaceManager, BrowserWorkspace } from '@cozanetos/workspaces';

// Access the running workspace manager
const manager = WorkspaceManager.getInstance();

// Create and open a new browser workspace
const browserTab = new BrowserWorkspace({
  id: 'agent-search-01',
  initialUrl: 'https://news.ycombinator.com',
  isAgentControlled: true
});

// Add to the layout grid on the right split
manager.layout.addWorkspace(browserTab, { position: 'right', ratio: 0.5 });

// Programmatically hook workspace events
browserTab.on('navigate', (url) => {
  console.log(`Agent-directed browser navigated to: ${url}`);
});
```

---

## Integration with Other CozanetOS Modules

This module is designed to interact seamlessly with other core layers of the CozanetOS ecosystem:

- **cozanet-apps**: Supplies context and launchers for external apps installed into the operating system.
- **cozanet-core**: Bridges file operations, security constraints, and database connections to active viewports.
- **cozanet-cx7**: Provides the underlying vector rendering and diagramming layer for the CX7 Studio workspace.
- **cozanet-browser / cozanet-terminal**: Supplies the low-level headless drivers, terminal processes, and network tunnels required by interactive workspaces.

---

## Quick-Start Notes

To begin using **cozanet-workspaces** inside your CozanetOS development environment:

### 1. Installation
Add the module to your application:
```bash
npm install @cozanetos/workspaces
# or
yarn add @cozanetos/workspaces
```

### 2. Configuration
Ensure your environment variables are configured in your `.env` file or registered inside your CozanetOS dashboard:
```env
COZANET_ENV=development
# Add module-specific configuration as required
```

### 3. Initialize & Run
Import the core module and start the process:
```javascript
import { Initialize } from '@cozanetos/workspaces';

Initialize().then(() => {
  console.log('cozanet-workspaces initialized successfully within CozanetOS.');
});
```

---

## License & Support
Part of the CozanetOS open platform suite. For security disclosures, active status monitors, or developer support, please visit the central CozanetOS portal.
