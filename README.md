# CozanetOS Workspaces

The official workspace orchestration and layout management framework for **Cozanet OS**, powered by **CEO AI**.

## Philosophy

In **Cozanet OS**, workspaces are context-rich user interface windows that the **CEO AI** opens, focuses, resizes, or closes depending on the task currently being executed. Rather than forcing the human user (or the agent itself) to manually manage window configurations, the system manages contexts programmatically based on the active flow.

### Task-to-Workspace Mappings

The **CEO AI** evaluates the active goal and launches targeted workspaces to support it:

- **Research** ➜ Browser Workspace + Notes Workspace
- **Coding** ➜ Code Editor Workspace + Terminal Workspace
- **Learning** ➜ CX7 3D Engine Workspace + Voice/Notes Workspace
- **Planning** ➜ Notes Workspace + System Dashboard Workspace
- **Debugging** ➜ Log Stream Workspace + Terminal + Code Editor
- **Data Operations** ➜ Database + Dashboard Workspaces
- **Communication** ➜ Email / Messaging Workspaces
- **File Management** ➜ Files Workspace

---

## Architecture

This repository contains the core TypeScript engine responsible for layout optimization, session lifecycle, state syncing, and specialized workspaces:

1. **`WorkspaceManager` (`id: 'workspaces:manager'`)**
   - The central orchestrator. Receives task-level directives from the CEO AI and handles the spawning, updates, and terminations of workspace sessions.
2. **`LayoutEngine`**
   - Implements optimal layout placement strategies (`single`, `split-h`, `split-v`, `grid`, `focus`) depending on active screen real estate and workspace count.
3. **Specialized Workspace Controllers**
   - `BrowserWorkspace` (Syncs with the `browser:engine` microservice)
   - `CodeWorkspace` (Intelligent source code explorer)
   - `TerminalWorkspace` (Communicates with the `terminal:shell` backend execution environment)
   - `NotesWorkspace` (Manages document drafting and brainstorming logs)
   - `CX7Workspace` (Activates immersive spaces inside the CX7 WorldEngine)
   - `DashboardWorkspace` (Aggregates system-wide telemetry and overview stats)

---

## Installation & Usage

Install the package dependencies:

```bash
npm install
```

Build the TypeScript source:

```bash
npm run build
```

### Integration Example

```typescript
import { WorkspaceManager, LayoutEngine } from '@cozanet/workspaces';

const manager = new WorkspaceManager();
const layoutEngine = new LayoutEngine();

// Create a new UI Session for a user
const session = manager.createSession('user-id-999');

// CEO AI decides to initiate coding tasks
const opened = await manager.openForTask('coding', session.id);

// Dynamically optimize the window arrangement
const optimalLayout = layoutEngine.arrange(opened, 'split-v');
manager.setLayout(session.id, optimalLayout);
```

---

## Tech Stack
- **TypeScript**
- **eventemitter3** (Event-driven workspace bus)
- **@supabase/supabase-js** (Optional cloud state synchronization)
- **zod** (Config validation)
- **pino** (High performance structured logs)
- **uuid** (Id generations)
