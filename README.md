# FlowTicket - Auto Ticket Classification Using Flow Designer

FlowTicket is an enterprise IT Service Management (ITSM) web application that automatically classifies incoming incident tickets and routes them to the correct support team using an interactive visual **Flow Designer**.

The application runs entirely in the browser using local NLP rule heuristics and client-side state storage. **No external databases, servers, or API keys are required.**

---

## Features

- **Interactive Visual Flow Designer**:
  - Full workflow pipeline visualization: Trigger (`Ticket Created`) &rarr; Action (`Analyze Ticket Description`) &rarr; Action (`Classify Category`) &rarr; Action (`Determine Priority`) &rarr; Action (`Select Assignment Group`) &rarr; Condition (`Confidence >= 70%?`) &rarr; Branching routes (`Automatically Assign Ticket` or `Send to Service Desk for Manual Review`) &rarr; Action (`Update Ticket Record`) &rarr; End (`Flow Completed`).
  - Interactive node inspector to inspect configuration parameters, toggle execution states, and view I/O schemas.
  - Interactive **Test Flow** sandbox runner: simulate any sample incident or custom description with step-by-step delay animations, real-time checkmarks, latency timing, and final routing output.
- **Automated Classification Engine**:
  - Deterministic multi-tier keyword and semantic pattern matching across 7 IT taxonomies (Network, Hardware, Software, Email, Access Management, Security, Human Resources) with default fallback to General IT / Service Desk.
  - Strict priority resolution matrix: `Critical` &rarr; `High` &rarr; `Medium` &rarr; `Low`.
  - Confidence scoring formula calculating token matches, exact phrases, and severity signals.
  - Generates audit-trail flow execution steps stored directly on each ticket.
- **ITSM Operations Dashboard**:
  - Real-time statistics: Total Tickets, New Tickets, In Progress, Resolved, Critical Alerts, Auto-Classified Rate, and Pending Triage.
  - High-clarity CSS/SVG charts: Tickets by Category, Tickets by Priority severity, Status breakdowns, and Assignment Group workload share.
  - Quick action links and live recently ingested incidents feed.
- **Full Incident Management**:
  - Multi-attribute search (ticket ID, keywords, requester, title, description).
  - Multi-filtering by Category, Priority, Status, and Assignment Group.
  - Sort by ID, creation date, priority weight, and confidence.
  - Pagination, quick inline editing of status/priority, safe ticket deletion, and one-click **Reclassify Ticket**.
- **Ticket Creation with Auto-Classify Preview**:
  - Automatic sequential incident ID generation (e.g., `INC-1015`).
  - One-click "Auto Classify Ticket" button to dry-run classification on the draft before submission.
  - Pre-packaged real-world scenario presets (Wi-Fi drop, server crash, password lockout, phishing alert, payroll inquiry).
- **Classification Rules Management**:
  - Add, edit, delete, and enable/disable category rules and keyword dictionaries.
  - Integrated Rule Matcher Sandbox to test text against active rules.
- **Assignment Groups**:
  - Manage resolver teams (Service Desk, Network Support, Hardware Support, Application Support, Email Support, Identity & Access Support, Security Operations, HR Support).
  - Dynamically calculates live open ticket workload per group.
- **Analytics & SLA Telemetry**:
  - Auto-classification percentage, average confidence, manual review queue ratio, and resolution rates.
  - Top extracted keyword signals cloud.
- **Settings & Persistence**:
  - Toggle auto-classification, auto-assignment, and customize confidence threshold (40% - 95%).
  - Dark mode support with instantaneous theme toggle.
  - Full configuration JSON export and one-click factory reset.

---

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS
- **Routing**: React Router (`react-router-dom`)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` (with error isolation and fallback seeds)
- **Deployment**: Optimized for static hosting (Vercel, Cloudflare Pages, Netlify, GitHub Pages)

---

## Demo Login

The application provides a one-click demo login button on the sign-in screen, or you can enter the credentials manually:

- **Email**: `admin@example.com`
- **Password**: `admin123`

Session state is securely stored locally in the browser session.

---

## Project Structure

```text
├── index.html                   # HTML entry point with metadata & branding
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
├── vercel.json                  # SPA routing configuration for Vercel
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # React Router routes & auth guards
│   ├── index.css                # Global Tailwind CSS directives
│   ├── types/
│   │   └── index.ts             # Ticket, Rule, Group, Flow, and Settings types
│   ├── services/
│   │   ├── storage.ts           # Safe localStorage service & seed data
│   │   ├── classifier.ts        # Keyword NLP engine, priority & confidence math
│   │   └── flowEngine.ts        # Flow Designer graph nodes & connections
│   ├── context/
│   │   └── AppContext.tsx       # Global application state & operations
│   ├── components/
│   │   ├── common/              # Badges, modals, confirm dialogs, metric cards, toasts
│   │   ├── layout/              # Sidebar, Topbar, Layout shell
│   │   └── flow/                # FlowCanvas, FlowNodeCard, NodeDetailModal, FlowTestModal
│   └── pages/
│       ├── LoginPage.tsx        # Authentication & Demo login
│       ├── DashboardPage.tsx    # ITSM executive dashboard & metrics
│       ├── TicketsPage.tsx      # Ticket catalog, filters, pagination, batch actions
│       ├── CreateTicketPage.tsx # Ticket creation with instant auto-classifier
│       ├── TicketDetailPage.tsx # Ticket inspector with Flow Execution History
│       ├── FlowDesignerPage.tsx # Interactive workflow designer & runner
│       ├── RulesPage.tsx        # Classification rules CRUD & keyword sandbox
│       ├── GroupsPage.tsx       # Support assignment queues & workload metrics
│       ├── AnalyticsPage.tsx    # Detailed charts, resolution ratios & telemetry
│       └── SettingsPage.tsx     # Thresholds, dark mode, reset & JSON export
```

---

## How Auto Classification Works

1. **Text Normalization**: The ticket title and detailed description are concatenated, converted to lower case, and stripped of extraneous punctuation.
2. **Taxonomy & Keyword Tokenization**: The engine scans for tokens and phrases defined in active classification rules. Exact multi-word matches (e.g. `cannot login`, `server down`) receive weighted scoring over single tokens.
3. **Category Matching**: The rule with the highest match score determines the primary Category and detects the most appropriate Subcategory.
4. **Priority Determination**: The text is evaluated against strict severity indicators:
   - **Critical**: `server down`, `system down`, `production down`, `security breach`, `ransomware`, `major outage`, `all users affected`.
   - **High**: `urgent`, `critical`, `cannot work`, `business stopped`, `multiple users`, `important system unavailable`.
   - **Medium**: `not working`, `error`, `problem`, `issue`, `unable`, `slow`.
   - **Low**: `request`, `information`, `question`, `minor`, `general inquiry`.
   - If multiple match, the highest priority wins.
5. **Assignment Group Selection**: The ticket is routed to the target team specified in the matched rule (e.g., Network Support, Security Operations, Identity & Access Support).
6. **Confidence Calculation**: A percentage score ($0-100\%$) is derived based on token quantity, phrase specificity, and priority signal alignment.
7. **Threshold Gate**: If confidence $\ge$ the configured threshold (default $70\%$) and automatic assignment is enabled, the ticket is auto-dispatched. Otherwise, it is flagged for manual Service Desk triage.

---

## Flow Designer Explanation

The visual Flow Designer models IT incident automation as a Directed Acyclic Graph (DAG):

- **Trigger (`Ticket Created`)**: Ingestion point for web and API submissions.
- **Action (`Analyze Ticket Description`)**: Preprocesses raw text and extracts keywords.
- **Action (`Classify Category`)**: Evaluates active rule taxonomies.
- **Action (`Determine Priority`)**: Assesses operational impact and urgency.
- **Action (`Select Assignment Group`)**: Maps category to the corresponding resolver queue.
- **Condition (`Confidence >= 70%?`)**: Evaluates quality threshold.
  - **YES Branch**: Calls `Automatically Assign Ticket` &rarr; dispatches directly to the resolver queue.
  - **NO Branch**: Calls `Send to Service Desk for Manual Review` &rarr; flags for human triage.
- **Action (`Update Ticket Record`)**: Persists classification, status, and saves step execution logs.
- **End (`Flow Completed`)**: Finalizes workflow and logs latency.

Clicking **Test Flow** triggers an animated simulation that executes each node step-by-step with real inputs and outputs.

---

## How to Run Locally

### Prerequisites
- Node.js (version 18 or newer)
- npm (version 9 or newer)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/flowticket.git
cd flowticket

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## How to Build

To create an optimized production build:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

To test the production build locally:

```bash
npm run preview
```

---

## How to Deploy to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite** (detected automatically).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

No environment variables or API keys are required. The included `vercel.json` ensures that all client-side routes (e.g. `/tickets`, `/flow-designer`) work smoothly upon browser refresh.

---

## License

MIT
