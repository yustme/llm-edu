# AI Agents Interactive Educational App

University teaching tool for explaining AI agents in the data world. Interactive presentation where students click through steps and see animated visualizations.

Tech Stack: Vite 6 + React 19 + TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, React Flow, Zustand, React Router v7, react-syntax-highlighter, Lucide React, pnpm.

<!-- PHASE:1 -->
## Phase 1: Project Skeleton + Layout

### Branch
`phase-1-skeleton`

### Scope
Initialize Vite + React + TS project with pnpm. Install and configure Tailwind CSS v4, shadcn/ui. Create full folder structure. Implement layout components (AppShell, ModuleNav, StepProgress, StepControls). React Router setup with lazy-loaded module routes. Zustand stores. Home page with module overview cards.

**File Structure:**
```
vse-mgr-agents/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── components.json                   # shadcn/ui config
├── .gitignore
├── .env
├── src/
│   ├── main.tsx
│   ├── App.tsx                       # routing + layout
│   ├── index.css                     # Tailwind imports
│   ├── config/
│   │   ├── app.config.ts            # module names, order, descriptions
│   │   ├── simulation.config.ts     # timing defaults, delays
│   │   └── theme.config.ts          # agent colors, custom tokens
│   ├── types/
│   │   ├── agent.types.ts
│   │   ├── module.types.ts
│   │   ├── mcp.types.ts
│   │   └── semantic.types.ts
│   ├── stores/
│   │   ├── presentation.store.ts
│   │   └── simulation.store.ts
│   ├── data/
│   │   └── modules.ts
│   ├── lib/
│   │   └── utils.ts                 # shadcn cn() utility
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components (Button, Card, Tabs, Badge, Progress, ScrollArea, Separator, Tooltip)
│   │   └── layout/
│   │       ├── AppShell.tsx
│   │       ├── ModuleNav.tsx
│   │       ├── StepProgress.tsx
│   │       └── StepControls.tsx
│   └── modules/
│       ├── Home/index.tsx
│       ├── Module1/index.tsx        # placeholder
│       ├── Module2/index.tsx        # placeholder
│       ├── Module3/index.tsx        # placeholder
│       └── Module4/index.tsx        # placeholder
```

### Files to Create/Modify
- `index.html`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `components.json`
- `.gitignore`
- `.env`
- `src/main.tsx`
- `src/App.tsx`
- `src/index.css`
- `src/config/app.config.ts`
- `src/config/simulation.config.ts`
- `src/config/theme.config.ts`
- `src/types/agent.types.ts`
- `src/types/module.types.ts`
- `src/types/mcp.types.ts`
- `src/types/semantic.types.ts`
- `src/stores/presentation.store.ts`
- `src/stores/simulation.store.ts`
- `src/data/modules.ts`
- `src/lib/utils.ts`
- `src/components/ui/button.tsx` (and other shadcn components)
- `src/components/layout/AppShell.tsx`
- `src/components/layout/ModuleNav.tsx`
- `src/components/layout/StepProgress.tsx`
- `src/components/layout/StepControls.tsx`
- `src/modules/Home/index.tsx`
- `src/modules/Module1/index.tsx`
- `src/modules/Module2/index.tsx`
- `src/modules/Module3/index.tsx`
- `src/modules/Module4/index.tsx`

### Acceptance Criteria
- [ ] `pnpm dev` starts without errors
- [ ] Tailwind CSS v4 is configured and utility classes work
- [ ] shadcn/ui components (Button, Card, Badge, Tabs, Progress, ScrollArea, Separator, Tooltip) are installed and render
- [ ] AppShell renders with sidebar (ModuleNav) and main content area
- [ ] ModuleNav shows all 4 modules + Home, with active state highlighting
- [ ] React Router navigates between Home (/), Module1 (/module/1), Module2 (/module/2), Module3 (/module/3), Module4 (/module/4)
- [ ] Lazy loading works for module routes
- [ ] StepProgress shows current step / total steps with progress bar
- [ ] StepControls has back/next/reset/play buttons, disabled states work correctly
- [ ] Zustand presentation store tracks currentModule, currentStep, totalSteps
- [ ] Zustand simulation store tracks isPlaying, speed, currentStepIndex
- [ ] Home page shows 4 module cards with title, description, icon, and "Start" button
- [ ] Module placeholder pages show module title and step navigation
- [ ] Config files contain all module metadata (names, descriptions, step counts)
- [ ] All type definitions are complete and exported
- [ ] Production build (`pnpm build`) succeeds with no errors

### Tests Required
- None for Phase 1 (UI/layout phase, tests start in Phase 2 with simulation engine)
<!-- /PHASE:1 -->

<!-- PHASE:2 -->
## Phase 2: Simulation Engine + Shared Components

### Branch
`phase-2-simulation-engine`

### Scope
Implement the core simulation engine and all shared presentation/simulation components. This is the foundation that all 4 modules will use.

**Simulation Engine:**
```typescript
interface SimulationStep {
  id: string;
  type: 'user-input' | 'llm-thinking' | 'tool-call' | 'tool-result' |
        'agent-message' | 'reasoning' | 'final-response';
  actor: string;
  content: string;
  metadata?: Record<string, unknown>;
  delayMs: number;
}
```

The useSimulation hook provides: play() / pause() / reset() / nextStep() / prevStep() / setSpeed(multiplier) / currentStep / visibleSteps (all steps up to current).

**Shared Components:**
- SlideContainer: animated slide wrapper using Framer Motion (AnimatePresence + motion.div)
- InfoPanel: left-side text explanations panel with title, bullet points, highlights
- InteractiveArea: right-side visualization area container
- ComparisonView: side-by-side split view (left vs right panels)
- CodeBlock: syntax-highlighted JSON/SQL using react-syntax-highlighter with dark theme
- ChatMessage: user/assistant message bubble with avatar, role badge, typing animation
- ThinkingIndicator: animated "thinking..." dots/spinner with customizable text
- ToolCallCard: expandable card showing tool name, input params, output result with syntax highlighting
- ReasoningStep: reasoning loop step display (numbered step with icon, content, status badge)

**Hooks:**
- useSimulation: core simulation playback control
- useTypewriter: typing animation effect (char by char with configurable speed)
- useStepNavigation: within-module step navigation (wraps presentation store)

**Lib:**
- simulation-engine.ts: core state machine (SimulationEngine class with event-driven step progression)
- formatters.ts: data display formatters (formatCurrency, formatNumber, formatSQL, formatJSON)

### Files to Create/Modify
- `src/lib/simulation-engine.ts`
- `src/lib/formatters.ts`
- `src/hooks/useSimulation.ts`
- `src/hooks/useTypewriter.ts`
- `src/hooks/useStepNavigation.ts`
- `src/components/presentation/SlideContainer.tsx`
- `src/components/presentation/InfoPanel.tsx`
- `src/components/presentation/InteractiveArea.tsx`
- `src/components/presentation/ComparisonView.tsx`
- `src/components/presentation/CodeBlock.tsx`
- `src/components/simulation/ChatMessage.tsx`
- `src/components/simulation/ThinkingIndicator.tsx`
- `src/components/simulation/ToolCallCard.tsx`
- `src/components/simulation/ReasoningStep.tsx`
- `src/tests/lib/simulation-engine.test.ts`

### Acceptance Criteria
- [ ] SimulationEngine class handles step progression correctly (play, pause, reset, next, prev)
- [ ] SimulationEngine respects speed multiplier (0.5x, 1x, 2x) for step delays
- [ ] SimulationEngine emits events on step change, completion, and reset
- [ ] useSimulation hook exposes play/pause/reset/nextStep/prevStep/setSpeed/currentStep/visibleSteps
- [ ] useTypewriter hook animates text character by character with configurable speed
- [ ] useStepNavigation hook provides goToStep/nextStep/prevStep/canGoNext/canGoPrev
- [ ] SlideContainer animates content entry/exit with Framer Motion (fade + slide)
- [ ] InfoPanel renders title, description paragraphs, and bullet point lists
- [ ] InteractiveArea provides a styled container for right-side visualizations
- [ ] ComparisonView splits into two equal panels with a vertical divider and labels
- [ ] CodeBlock renders syntax-highlighted JSON and SQL with line numbers, using a dark theme
- [ ] ChatMessage renders user messages (right-aligned, blue) and assistant messages (left-aligned, gray) with avatar and role
- [ ] ThinkingIndicator shows animated dots and customizable "thinking" text
- [ ] ToolCallCard shows tool name, expandable input/output sections with CodeBlock, status badge
- [ ] ReasoningStep shows numbered step with icon, content text, and status (pending/active/done)
- [ ] formatters.ts exports formatCurrency, formatNumber, formatSQL, formatJSON
- [ ] All simulation engine tests pass
- [ ] `pnpm build` succeeds

### Tests Required
- `src/tests/lib/simulation-engine.test.ts`:
  - Test step progression (play advances through steps)
  - Test pause stops progression
  - Test reset returns to beginning
  - Test nextStep/prevStep manual navigation
  - Test speed multiplier affects timing
  - Test completion callback fires at end
  - Test visibleSteps accumulates correctly
  - Test boundary conditions (prev at start, next at end)
<!-- /PHASE:2 -->

<!-- PHASE:3 -->
## Phase 3: Module 1 - Agent vs LLM

### Branch
`phase-3-module1-agent-vs-llm`

### Scope
Implement Module 1 with all 6 steps showing the difference between a plain LLM and an AI agent. Includes mock data, step components, and interactive demos.

**Mock Data (mock-llm-responses.ts):**
- Pre-built queries: "What was Q4 revenue?", "Show top 5 customers", "What's the monthly trend?"
- Plain LLM responses: apologetic "I don't have access to data" responses
- Agent reasoning loops: reasoning -> tool_call(SQL) -> tool_result -> reasoning -> final answer
- Comparison data: side-by-side differences table

**Steps:**
1. **Introduction**: "LLMs are powerful but limited..." with simple User -> LLM -> Text diagram
2. **Plain LLM Demo**: ChatMessage simulation - user asks data question, LLM gives unhelpful answer
3. **What is an Agent?**: Animated diagram - LLM center, Tools/Reasoning Loop/Memory layers animate in with Framer Motion
4. **Agent Demo**: Full reasoning loop simulation with expandable ToolCallCards showing SQL queries and results
5. **Comparison**: ComparisonView with plain LLM vs Agent responses side by side, plus comparison table
6. **Summary**: Key takeaways with recap architecture diagram

**Interactions:**
- Dropdown/buttons to select from pre-built queries
- Step-by-step vs auto-play toggle
- Speed control (0.5x/1x/2x)
- Expandable tool call details in Agent Demo

### Files to Create/Modify
- `src/data/mock-llm-responses.ts`
- `src/modules/Module1/index.tsx`
- `src/modules/Module1/data.ts`
- `src/modules/Module1/steps/Step1Intro.tsx`
- `src/modules/Module1/steps/Step2PlainLLM.tsx`
- `src/modules/Module1/steps/Step3WhatIsAgent.tsx`
- `src/modules/Module1/steps/Step4AgentDemo.tsx`
- `src/modules/Module1/steps/Step5Comparison.tsx`
- `src/modules/Module1/steps/Step6Summary.tsx`

### Acceptance Criteria
- [ ] Module 1 loads via lazy route /module/1
- [ ] Step 1 shows intro text and simple User->LLM->Text diagram with Framer Motion animation
- [ ] Step 2 simulates a chat where user asks a data question and LLM responds with "I don't have access..."
- [ ] Step 3 shows animated diagram where Tools, Reasoning Loop, and Memory layers appear sequentially around LLM center
- [ ] Step 4 plays a full agent reasoning loop: thinking -> SQL tool call -> result -> more thinking -> final answer
- [ ] Step 4 ToolCallCards are expandable showing SQL query and JSON result
- [ ] Step 5 shows ComparisonView with LLM response (left) vs Agent response (right) plus difference table
- [ ] Step 6 shows summary takeaways and architecture recap
- [ ] Pre-built query selection works (at least 3 queries available)
- [ ] Step-by-step mode works (clicking "Next Step" advances simulation one step at a time)
- [ ] Auto-play mode works (simulation advances automatically)
- [ ] Speed control works (0.5x/1x/2x)
- [ ] Step navigation (back/next between module steps) works correctly
- [ ] All animations are smooth (no flicker, proper enter/exit transitions)
- [ ] `pnpm build` succeeds

### Tests Required
- None (UI module, tested visually; simulation engine already tested in Phase 2)
<!-- /PHASE:3 -->

<!-- PHASE:4 -->
## Phase 4: Module 2 - Multi-Agent Communication

### Branch
`phase-4-module2-multi-agent`

### Scope
Implement Module 2 with React Flow diagrams showing 3 agents collaborating on a data task.

**3 Agents:**
- **Data Analyst** (purple, Brain icon): Understands business questions, creates analysis plans, interprets results
- **Data Engineer** (green, Database icon): Writes SQL queries, manages data pipelines, optimizes queries
- **Reporting Agent** (amber, BarChart icon): Creates visualizations, formats reports, generates summaries

**Task:** "Show monthly sales trend by category for 2025"

**Mock Data (mock-multi-agent.ts):**
- Agent definitions (name, role, tools, color, icon)
- Complete message sequence (12-15 messages between agents)
- Workflow: User -> Analyst (breaks down task) -> Engineer (writes SQL) -> Engineer (returns data) -> Reporter (formats) -> User (final report)

**React Flow Components:**
- AgentNode: Custom node showing agent avatar, name, role, status badge (idle/working/done)
- AgentCard: Detailed agent card with tools list and description
- MessageEdge: Custom animated edge with message preview, color-coded by sender
- AgentWorkflow: Full React Flow diagram with auto-layout

**Steps:**
1. Introduction: "Why multiple agents?" with simple vs team diagram
2. Meet the Agents: 3 AgentCards with details
3. Workflow: React Flow diagram showing agent connections and message flow direction
4. Step-by-step Animation: React Flow where nodes activate sequentially, messages appear on edges
5. Message Detail: Vertical timeline of all messages, color-coded, filterable by agent
6. Summary: Key points with summary diagram

### Files to Create/Modify
- `src/data/mock-multi-agent.ts`
- `src/components/agents/AgentCard.tsx`
- `src/components/agents/AgentNode.tsx`
- `src/components/agents/MessageEdge.tsx`
- `src/components/agents/AgentWorkflow.tsx`
- `src/modules/Module2/index.tsx`
- `src/modules/Module2/data.ts`
- `src/modules/Module2/steps/Step1Intro.tsx`
- `src/modules/Module2/steps/Step2MeetAgents.tsx`
- `src/modules/Module2/steps/Step3Workflow.tsx`
- `src/modules/Module2/steps/Step4Animation.tsx`
- `src/modules/Module2/steps/Step5Messages.tsx`
- `src/modules/Module2/steps/Step6Summary.tsx`

### Acceptance Criteria
- [ ] React Flow (@xyflow/react) is installed and working
- [ ] Module 2 loads via lazy route /module/2
- [ ] Step 1 shows intro with "one person" vs "team of specialists" concept diagrams
- [ ] Step 2 shows 3 AgentCards with name, role, color, icon, tools list, and description
- [ ] Step 3 shows React Flow diagram with 3 agent nodes + user node, directional edges showing message flow
- [ ] Step 4 animates the workflow: nodes change status (idle->working->done), messages appear on edges sequentially
- [ ] Step 4 supports step-by-step and auto-play modes
- [ ] Step 5 shows vertical timeline of all messages, color-coded by agent, with message content
- [ ] Step 6 shows summary with key points
- [ ] Clicking a node in React Flow shows agent detail
- [ ] Clicking an edge shows message content
- [ ] AgentNode shows status badge (idle=gray, working=yellow pulse, done=green)
- [ ] MessageEdge is animated (dashed line moving in direction of message flow)
- [ ] All agent colors match: Data Analyst=purple, Data Engineer=green, Reporting Agent=amber
- [ ] `pnpm build` succeeds

### Tests Required
- None (UI/visualization module, tested visually)
<!-- /PHASE:4 -->

<!-- PHASE:5 -->
## Phase 5: Module 3 - MCP Server

### Branch
`phase-5-module3-mcp-server`

### Scope
Implement Module 3 showing the MCP (Model Context Protocol) server concept with interactive diagrams and JSON-RPC protocol visualization.

**Mock Data (mock-mcp-flows.ts):**
- JSON-RPC message sequences: initialize, tools/list, tools/call
- MCP server definitions (Database server, API server, File server)
- Capability definitions (Resources, Tools, Prompts)
- Sample DB query flow with mock results

**Components:**
- MCPArchitecture: Interactive React Flow diagram showing Host->Client->Server architecture
- MCPServerNode: Custom React Flow node for MCP servers (with icon, name, capabilities list)
- ProtocolFlow: Animated JSON-RPC message flow visualization (messages flying between client/server)
- DatabasePanel: Mock database panel showing tables, schema, and query results

**Steps:**
1. Introduction: N*M problem -> MCP standard (USB-C analogy), before/after animated diagram
2. Architecture: React Flow with Host (contains Client) -> Protocol -> Server nodes, clickable for details
3. Protocol: JSON-RPC 2.0 animated flow - initialize -> tools/list -> tools/call with JSON blocks
4. DB Query Demo: Full simulation - agent -> tools/call -> MCP -> SQL execution -> result -> interpretation
5. Capabilities: 3 expandable cards - Resources (data access), Tools (actions), Prompts (templates)
6. Summary: Key points with final architecture diagram

### Files to Create/Modify
- `src/data/mock-mcp-flows.ts`
- `src/components/mcp/MCPArchitecture.tsx`
- `src/components/mcp/MCPServerNode.tsx`
- `src/components/mcp/ProtocolFlow.tsx`
- `src/components/mcp/DatabasePanel.tsx`
- `src/modules/Module3/index.tsx`
- `src/modules/Module3/data.ts`
- `src/modules/Module3/steps/Step1Intro.tsx`
- `src/modules/Module3/steps/Step2Architecture.tsx`
- `src/modules/Module3/steps/Step3Protocol.tsx`
- `src/modules/Module3/steps/Step4DBQuery.tsx`
- `src/modules/Module3/steps/Step5Capabilities.tsx`
- `src/modules/Module3/steps/Step6Summary.tsx`

### Acceptance Criteria
- [ ] Module 3 loads via lazy route /module/3
- [ ] Step 1 shows N*M problem with animated before/after diagrams and USB-C analogy text
- [ ] Step 2 shows React Flow architecture: Host node (containing Client) connected to multiple Server nodes
- [ ] Step 2 nodes are clickable showing detail panels (description, capabilities)
- [ ] Step 3 shows animated JSON-RPC protocol flow with initialize, tools/list, tools/call messages
- [ ] Step 3 JSON blocks are syntax-highlighted and animate between client and server
- [ ] Step 4 simulates complete DB query flow: agent decides -> MCP tools/call -> SQL executed -> result returned
- [ ] Step 4 shows DatabasePanel with mock tables alongside JSON-RPC messages
- [ ] Step 5 shows 3 expandable capability cards (Resources, Tools, Prompts) with examples
- [ ] Step 6 shows summary with architecture recap
- [ ] MCPServerNode shows server name, icon, and capability badges
- [ ] ProtocolFlow shows JSON messages with directional animation (left-to-right for requests, right-to-left for responses)
- [ ] All simulations support step-by-step and auto-play modes
- [ ] `pnpm build` succeeds

### Tests Required
- None (UI/visualization module, tested visually)
<!-- /PHASE:5 -->

<!-- PHASE:6 -->
## Phase 6: Module 4 - Semantic Layer

### Branch
`phase-6-module4-semantic-layer`

### Scope
Implement Module 4 showing why semantic layers are important with a concrete e-commerce dataset demo.

**Sample Dataset - "TechShop" E-commerce (sample-dataset.ts):**
- `orders` table (15 rows): order_id, customer_id, product_id, order_amount, discount, tax_amount, status (completed/cancelled/returned/pending), order_date
- `products` table (8 rows): product_id, name, category, price
- `customers` table (7 rows): customer_id, name, email, segment

**Key Demo - "What is total revenue?" (queries.ts):**

WITHOUT semantic layer - 3 different agent runs produce different results:
| Run | SQL | Result | Problem |
|-----|-----|--------|---------|
| 1 | `SUM(order_amount) FROM orders` | 282,820 CZK | Includes cancelled & returned |
| 2 | `SUM(order_amount + tax_amount) WHERE status='completed'` | 271,037 CZK | Double-counts tax |
| 3 | `SUM(order_amount - discount) WHERE status != 'cancelled'` | 229,850 CZK | Includes returned & pending |

WITH semantic layer - consistent definition (semantic-definitions.ts):
```yaml
total_revenue:
  calculation: "SUM(order_amount - discount)"
  filters: ["status = 'completed'"]
```
Result: **173,380 CZK** - same every time.

**Components:**
- DatasetTable: Tabbed table showing orders/products/customers with highlighting
- QueryPanel: Shows the query being asked
- ResultPanel: Shows query result with success/error/warning states
- SemanticDefinition: Card showing metric definition (name, calculation, filters, description)

**Steps:**
1. Introduction: Same question, different answers animation (3 numbers appearing)
2. Dataset: DatasetTable with 3 tabs (orders/products/customers), schema info
3. Without Semantic Layer: 3 simulation runs, each with different SQL and different result, red inconsistency highlights
4. With Semantic Layer: SemanticDefinition cards, same query 3x -> same result, green consistency
5. Comparison: ComparisonView left (3 different results, red) vs right (3 same results, green)
6. Summary: What is semantic layer, why use it, tools (dbt, Cube.dev, etc.), diagram

### Files to Create/Modify
- `src/data/sample-dataset.ts`
- `src/data/semantic-definitions.ts`
- `src/data/queries.ts`
- `src/components/semantic/DatasetTable.tsx`
- `src/components/semantic/QueryPanel.tsx`
- `src/components/semantic/ResultPanel.tsx`
- `src/components/semantic/SemanticDefinition.tsx`
- `src/modules/Module4/index.tsx`
- `src/modules/Module4/data.ts`
- `src/modules/Module4/steps/Step1Intro.tsx`
- `src/modules/Module4/steps/Step2Dataset.tsx`
- `src/modules/Module4/steps/Step3WithoutSemantic.tsx`
- `src/modules/Module4/steps/Step4WithSemantic.tsx`
- `src/modules/Module4/steps/Step5Comparison.tsx`
- `src/modules/Module4/steps/Step6Summary.tsx`

### Acceptance Criteria
- [ ] Module 4 loads via lazy route /module/4
- [ ] Step 1 shows intro animation with same question producing 3 different numbers
- [ ] Step 2 shows DatasetTable with 3 tabs (orders/products/customers), data is visible and schema shown
- [ ] Step 3 runs 3 simulations sequentially, each showing different SQL, different result, and highlighting the problem
- [ ] Step 3 results are highlighted in red to show inconsistency (282,820 vs 271,037 vs 229,850)
- [ ] Step 4 shows SemanticDefinition cards for total_revenue metric
- [ ] Step 4 runs same query 3 times, all producing 173,380 CZK, highlighted in green
- [ ] Step 5 shows ComparisonView: left=inconsistent (red), right=consistent (green) with difference table
- [ ] Step 6 shows summary with semantic layer explanation, example tools, and architecture diagram
- [ ] DatasetTable allows switching between tabs
- [ ] QueryPanel displays the current query clearly
- [ ] ResultPanel shows result with appropriate styling (red for inconsistent, green for consistent)
- [ ] SemanticDefinition shows metric name, calculation formula, filters, and description
- [ ] All simulations support step-by-step and auto-play
- [ ] All amounts display in CZK format
- [ ] `pnpm build` succeeds

### Tests Required
- None (UI/visualization module, tested visually)
<!-- /PHASE:6 -->

<!-- PHASE:7 -->
## Phase 7: Polish + Keyboard Navigation

### Branch
`phase-7-polish`

### Scope
Add keyboard navigation, responsive adjustments for projectors/large screens, and final animation tuning across all modules.

**Keyboard Navigation:**
- Left/Right arrows: navigate between steps within current module
- Space: toggle play/pause for simulations
- Escape: reset current simulation
- Number keys 1-4: jump to module
- Home: go to home page

**Responsive:**
- Optimize for 1920x1080 (projector) and larger displays
- Ensure React Flow diagrams resize properly
- Ensure text is readable at projector distance (minimum font sizes)
- Sidebar collapses on smaller viewports if needed

**Polish:**
- Consistent animation timing across all modules
- Smooth transitions between steps and modules
- Loading states for lazy-loaded modules
- Error boundaries for module loading failures
- Focus management for accessibility

### Files to Create/Modify
- `src/hooks/useKeyboardNavigation.ts`
- `src/App.tsx` (add keyboard handler, error boundaries, loading states)
- `src/components/layout/AppShell.tsx` (responsive adjustments)
- `src/index.css` (responsive font sizes, projector optimizations)
- Various module files (animation timing tweaks)

### Acceptance Criteria
- [ ] Left/Right arrow keys navigate between steps
- [ ] Space toggles play/pause
- [ ] Escape resets simulation
- [ ] Number keys 1-4 jump to modules
- [ ] Home key goes to home page
- [ ] App looks good at 1920x1080 resolution
- [ ] React Flow diagrams resize with container
- [ ] Text is readable at distance (adequate font sizes)
- [ ] Lazy-loaded modules show loading spinner
- [ ] Module loading errors show error boundary fallback
- [ ] All module transitions are smooth (no visual glitches)
- [ ] `pnpm build` succeeds with no warnings
- [ ] All 4 modules with all steps are fully navigable

### Tests Required
- None (polish/UX phase, tested manually)
<!-- /PHASE:7 -->
