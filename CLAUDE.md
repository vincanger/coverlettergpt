# CLAUDE.md - CoverLetterGPT Codebase Guide

> Comprehensive guide for AI assistants working on the CoverLetterGPT codebase

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Development Setup](#development-setup)
- [Database Schema](#database-schema)
- [Routes & Pages](#routes--pages)
- [Operations (Actions & Queries)](#operations-actions--queries)
- [Key Features](#key-features)
- [API Integrations](#api-integrations)
- [Coding Conventions](#coding-conventions)
- [Common Workflows](#common-workflows)
- [Important Considerations](#important-considerations)

---

## Project Overview

**CoverLetterGPT.xyz** is a SaaS application that generates personalized cover letters using OpenAI's GPT models. Users can:
- Create and manage job postings
- Generate cover letters based on job descriptions and their resume
- Choose between different GPT models (GPT-4o, GPT-4o-mini)
- Customize creativity levels and include optional witty remarks
- Pay via Stripe subscriptions or Bitcoin Lightning payments

**Website**: https://coverlettergpt.xyz
**Wasp Version**: ^0.15.0

---

## Tech Stack

### Core Framework
- **Wasp** (v0.15.0) - Full-stack framework providing:
  - Server-side routing and API endpoints
  - Authentication (Google OAuth)
  - Database ORM (Prisma)
  - Type-safe operations (Actions/Queries)
  - Background jobs (PgBoss)

### Frontend
- **React** (v18.2.0) with TypeScript
- **Chakra UI** (v2.8.0) - Component library
- **Framer Motion** (v6.5.1) - Animations
- **React Hook Form** (v7.45.4) - Form management
- **Zod** (v3.22.4) - Schema validation
- **Vite** (v4.3.9) - Build tool

### Backend
- **Node.js** with Express
- **Prisma** (v5.19.1) - ORM
- **PostgreSQL** - Database
- **SendGrid** - Email service
- **PgBoss** - Job queue

### External Services
- **OpenAI API** - GPT-4o and GPT-4o-mini for cover letter generation
- **Stripe** - Payment processing (subscriptions and credits)
- **Google OAuth** - Authentication
- **Bitcoin Lightning** (Bolt11/LNURL) - Alternative payment method

---

## Architecture

CoverLetterGPT follows the Wasp framework's architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                        main.wasp                             │
│              (Central Configuration File)                    │
│  - Routes, Pages, Auth, Operations, Jobs, APIs              │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
   ┌────▼────┐                            ┌────▼────┐
   │  Client │                            │  Server │
   │  (React)│                            │(Express)│
   └────┬────┘                            └────┬────┘
        │                                      │
        │   ┌──────────────────────┐          │
        └───► Chakra UI Components │          │
            └──────────────────────┘          │
                                               │
                         ┌─────────────────────┴────────┐
                         │                              │
                    ┌────▼────┐              ┌─────────▼──────────┐
                    │ Actions │              │      Queries       │
                    │(Mutations)              │   (Read-only)      │
                    └────┬────┘              └─────────┬──────────┘
                         │                              │
                         └──────────┬───────────────────┘
                                    │
                            ┌───────▼────────┐
                            │ Prisma + PG DB │
                            └────────────────┘
```

---

## Directory Structure

```
coverlettergpt/
├── main.wasp                    # Wasp configuration (routes, auth, operations)
├── schema.prisma                # Database schema
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript configuration (IDE only)
├── vite.config.ts              # Vite build configuration
├── env.server.example          # Example environment variables
│
├── src/
│   ├── client/                 # Frontend React code
│   │   ├── *.tsx              # Page components
│   │   │   ├── MainPage.tsx   # Landing page (/)
│   │   │   ├── LoginPage.tsx  # Login page
│   │   │   ├── JobsPage.tsx   # Job management (auth required)
│   │   │   ├── CoverLetterPage.tsx  # Cover letter view (auth required)
│   │   │   ├── ProfilePage.tsx      # User profile (auth required)
│   │   │   └── CheckoutPage.tsx     # Payment page (auth required)
│   │   │
│   │   ├── components/        # Reusable React components
│   │   │   ├── NavBar.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LnPaymentModal.tsx
│   │   │   ├── CreativitySlider.tsx
│   │   │   └── ...
│   │   │
│   │   ├── legal/             # Legal pages (TOS, Privacy Policy)
│   │   ├── theme/             # Chakra UI theme customization
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── lightningUtils.ts  # Lightning payment utilities
│   │   ├── App.tsx            # Root component
│   │   └── clientSetup.ts     # Client initialization
│   │
│   ├── server/                # Backend Node.js code
│   │   ├── actions.ts         # Wasp actions (mutations)
│   │   │                      # - generateCoverLetter, createJob, updateJob
│   │   │                      # - stripePayment, stripeGpt4Payment, etc.
│   │   ├── queries.ts         # Wasp queries (read operations)
│   │   │                      # - getJobs, getCoverLetters, getUserInfo
│   │   ├── webhooks.ts        # API endpoints (Stripe webhook)
│   │   ├── ln.ts             # Lightning payment logic
│   │   ├── auth.ts           # Google OAuth configuration
│   │   └── workers/
│   │       └── updateUserSubscription.ts  # Cron job logic
│   │
│   ├── shared/                # Shared utilities (client + server)
│   │   └── utils.ts
│   │
│   └── vite-env.d.ts         # Vite type definitions
│
└── public/                    # Static assets
    └── homepage.png
```

---

## Development Setup

### Prerequisites
- Node.js (latest LTS)
- Docker (for local database)
- Wasp CLI

### Installation Steps

1. **Install Wasp**:
   ```bash
   curl -sSL https://get.wasp.sh/installer.sh | sh
   ```

2. **Clone and Install Dependencies**:
   ```bash
   git clone <repo>
   cd coverlettergpt
   ```
   *Note: Wasp manages dependencies automatically*

3. **Set Up Environment Variables**:
   ```bash
   cp env.server.example .env.server
   ```
   Edit `.env.server` and fill in:
   - `OPENAI_API_KEY` - Get from https://platform.openai.com/
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - Setup OAuth at Google Cloud Console
   - `DATABASE_URL` - Connection string (or use `wasp start db`)
   - `STRIPE_KEY` & price IDs - Get from Stripe dashboard
   - `SENDGRID_API_KEY` - For email notifications

4. **Start Local Database**:
   ```bash
   wasp start db
   ```
   *Requires Docker*

5. **Run Migrations**:
   ```bash
   wasp db migrate-dev
   ```

6. **Start Development Server**:
   ```bash
   wasp start
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

7. **Install VSCode Extension** (recommended):
   Search for "Wasp" in VSCode extensions marketplace

---

## Database Schema

### Entities Overview

The application uses PostgreSQL with Prisma ORM. Four main entities:

#### **User**
```prisma
model User {
  id                   Int       # Auto-incrementing primary key
  username             String    @unique
  email                String?
  hasPaid              Boolean   @default(false)
  isUsingLn            Boolean   @default(false)  # Using Lightning payments
  gptModel             String    @default("gpt-4o-mini")
  datePaid             DateTime?
  stripeId             String?
  checkoutSessionId    String?
  subscriptionStatus   String?   # active, past_due, canceled, etc.
  notifyPaymentExpires Boolean   @default(false)
  credits              Int       @default(3)      # Free credits

  # Relations
  letters              CoverLetter[]
  jobs                 Job[]
  lnData               LnData?
  lnPayments           LnPayment[]
}
```

#### **Job**
```prisma
model Job {
  id          String    @id @default(uuid())
  title       String
  company     String
  location    String
  description String    # Job posting details
  isCompleted Boolean   @default(false)

  # Relations
  coverLetter CoverLetter[]
  user        User?     @relation(fields: [userId], references: [id])
  userId      Int?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### **CoverLetter**
```prisma
model CoverLetter {
  id         String    @id @default(uuid())
  title      String
  content    String    # Generated cover letter text
  tokenUsage Int       # OpenAI tokens consumed

  # Relations
  job        Job       @relation(fields: [jobId], references: [id], onDelete: Cascade)
  jobId      String
  user       User?     @relation(fields: [userId], references: [id])
  userId     Int?

  createdAt  DateTime  @default(now())
  updatedAt  DateTime? @updatedAt
}
```

#### **LnPayment** & **LnData**
Lightning Network payment tracking:
- `LnPayment`: Individual payment records (invoice status, amount)
- `LnData`: User Lightning authentication data (LNURL-auth)

---

## Routes & Pages

All routes are defined in `main.wasp`:

| Path | Component | Auth Required | Purpose |
|------|-----------|---------------|---------|
| `/` | MainPage | No | Landing page with intro/CTA |
| `/login` | LoginPage | No | Google OAuth login |
| `/jobs` | JobsPage | Yes | Manage job postings |
| `/cover-letter/:id` | CoverLetterPage | Yes | View/edit specific cover letter |
| `/profile` | ProfilePage | Yes | User settings, subscription status |
| `/checkout` | CheckoutPage | Yes | Stripe payment flow |
| `/tos` | TosPage | No | Terms of Service |
| `/privacy` | PrivacyPage | No | Privacy Policy |

**Authentication Flow**:
- Wasp handles auth via Google OAuth automatically
- Pages with `authRequired: true` redirect to `/` if not logged in
- Auth state available via `useAuth()` hook

---

## Operations (Actions & Queries)

Wasp operations are type-safe RPC calls between client and server.

### Actions (Mutations)

**Cover Letter Generation**:
- `generateCoverLetter` - Create new cover letter from job + resume
- `updateCoverLetter` - Modify existing cover letter
- `editCoverLetter` - Direct text edits
- `generateEdit` - AI-powered edits (via GPT)

**Job Management**:
- `createJob` - Add new job posting
- `updateJob` - Edit job details
- `deleteJob` - Remove job and cascade delete cover letters

**User Management**:
- `updateUser` - Modify user settings

**Payments**:
- `stripePayment` - Create Stripe checkout session (GPT-3.5)
- `stripeGpt4Payment` - Create checkout for GPT-4 subscription
- `stripeCreditsPayment` - Buy additional credits
- `getLnLoginUrl` - Generate LNURL-auth login
- `decodeInvoice` - Parse Lightning invoice
- `updateLnPayment` - Update payment status
- `milliSatsToCents` - Currency conversion

### Queries (Read-Only)

- `getJobs` - Fetch all user's jobs
- `getJob` - Get single job by ID
- `getCoverLetter` - Fetch cover letter by ID
- `getCoverLetters` - Get all user's cover letters
- `getUserInfo` - Get current user's profile data
- `getLnUserInfo` - Get Lightning auth data
- `getCoverLetterCount` - Count total cover letters

**Usage Pattern**:
```typescript
// In client component
import { useQuery, useAction } from 'wasp/client/operations';
import { getJobs, createJob } from 'wasp/client/operations';

function JobsComponent() {
  const { data: jobs, isLoading } = useQuery(getJobs);
  const createJobFn = useAction(createJob);

  const handleCreate = async () => {
    await createJobFn({ title: "Engineer", company: "Acme" });
  };
}
```

---

## Key Features

### 1. Cover Letter Generation

**Location**: `src/server/actions.ts:99` (generateCoverLetter)

**Flow**:
1. Check user payment status (subscription, credits, or Lightning)
2. Validate job exists and belongs to user
3. Construct OpenAI prompt based on options:
   - `isCompleteCoverLetter`: Full letter vs. bullet points
   - `includeWittyRemark`: Add job-related joke
   - `temperature`: Creativity level (0.0-2.0)
4. Call OpenAI API with user's resume + job description
5. Save generated letter to database
6. Update user credits or Lightning payment status

**GPT Prompts** (see `src/server/actions.ts:25-39`):
- `completeCoverLetter`: Professional, detailed letter
- `coverLetterWithAWittyRemark`: Relaxed style + joke
- `ideasForCoverLetter`: Bullet point ideas only

### 2. Payment System

**Stripe Integration** (`src/server/actions.ts`):
- Two subscription tiers: GPT-4o-mini and GPT-4o
- Pay-per-use credits option
- Webhook handling in `src/server/webhooks.ts`
- Updates user's `hasPaid`, `subscriptionStatus`, `gptModel` fields

**Lightning Payments** (`src/server/ln.ts`):
- LNURL-auth for login
- Per-generation invoices
- Status tracking in `LnPayment` table
- Webhook callback at `/ln-login`

### 3. Subscription Management

**Cron Job**: `src/server/workers/updateUserSubscription.ts`
- Runs daily at 11 PM (cron: `0 23 * * *`)
- Checks if user's subscription expires in 2 weeks
- Sends reminder email via SendGrid
- Updates `notifyPaymentExpires` flag

---

## API Integrations

### OpenAI API

**Configuration**: `src/server/actions.ts:25`
- Models: `gpt-4o`, `gpt-4o-mini` (user-selectable)
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Request format:
  ```typescript
  {
    model: user.gptModel,
    messages: [
      { role: 'system', content: gptConfig.completeCoverLetter },
      { role: 'user', content: `Resume:\n${resume}\n\nJob:\n${jobDescription}` }
    ],
    temperature: 0.0-2.0
  }
  ```

### Stripe API

**Version**: `2023-08-16`
**Key Operations**:
- `stripe.checkout.sessions.create()` - Payment flow
- `stripe.webhooks.constructEvent()` - Verify webhook signatures
- Product Price IDs stored in env vars

### Google OAuth

**Setup**: `src/server/auth.ts`
- Configured via `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Wasp handles OAuth flow automatically
- Custom `getUserFields()` extracts email and username

---

## Coding Conventions

### TypeScript
- **Strict mode enabled** (`tsconfig.json`)
- Use Wasp-generated types from `wasp/entities` and `wasp/server/operations`
- Prefer explicit types for function parameters and return values
- Async/await for all asynchronous operations

### React Components
- **Functional components only** (no class components)
- Use hooks: `useState`, `useEffect`, `useQuery`, `useAction`
- Chakra UI components for all UI elements
- File naming: PascalCase for components (`MainPage.tsx`)

### Wasp Patterns
- **All operations in main.wasp**: Don't create ad-hoc API routes
- **Entity relations**: Always specify in Prisma schema
- **Error handling**: Throw `HttpError` from Wasp for proper client error handling
  ```typescript
  import { HttpError } from 'wasp/server';
  throw new HttpError(402, 'Payment required');
  ```

### Styling
- Use Chakra UI's `sx` prop or component props
- Custom theme in `src/client/theme/`
- Avoid inline styles or CSS files when possible

### File Organization
- Pages in `src/client/*.tsx`
- Reusable components in `src/client/components/`
- Server logic in `src/server/*.ts`
- Shared utilities in `src/shared/`

---

## Common Workflows

### Adding a New Page

1. **Create component**: `src/client/NewPage.tsx`
   ```typescript
   export function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. **Add route in main.wasp**:
   ```wasp
   route NewRoute { path: "/new", to: NewPage }
   page NewPage {
     authRequired: true,  // Optional
     component: import New from "@src/client/NewPage"
   }
   ```

3. **Restart Wasp**: `wasp start`

### Adding a New Action

1. **Define function in src/server/actions.ts**:
   ```typescript
   export const myNewAction: MyNewAction<Payload, Result> = async (args, context) => {
     // Access entities: context.entities.User
     // Access current user: context.user
     return result;
   };
   ```

2. **Register in main.wasp**:
   ```wasp
   action myNewAction {
     fn: import { myNewAction } from "@src/server/actions.js",
     entities: [User, Job]
   }
   ```

3. **Use in client**:
   ```typescript
   import { myNewAction } from 'wasp/client/operations';
   const myNewActionFn = useAction(myNewAction);
   await myNewActionFn({ data });
   ```

### Modifying Database Schema

1. **Edit schema.prisma**:
   ```prisma
   model User {
     newField String?
   }
   ```

2. **Create migration**:
   ```bash
   wasp db migrate-dev
   ```

3. **Restart Wasp**: Types will auto-update

### Adding Environment Variables

1. **Add to env.server.example**:
   ```
   NEW_API_KEY=your_key_here
   ```

2. **Update .env.server** (local)

3. **Access in code**:
   ```typescript
   const apiKey = process.env.NEW_API_KEY;
   ```

---

## Important Considerations

### Payment Logic
- **Always check payment status** before expensive operations (GPT calls)
- Helper function: `checkIfUserPaid()` in `src/server/actions.ts:75`
- Three payment modes:
  - `hasPaid` - Stripe subscription
  - `credits` - Pay-per-use credits
  - `isUsingLn` - Lightning payments (check `LnPayment.status`)

### Error Handling
- Use `HttpError` for client-facing errors
- Log sensitive errors server-side only
- Provide user-friendly error messages

### Security
- Never expose API keys client-side
- Validate user ownership of resources (jobs, letters)
- Stripe webhook signature verification required
- CORS configured by Wasp automatically

### Performance
- Cover letter generation can take 5-30 seconds (GPT API call)
- Show loading states in UI
- Consider implementing rate limiting for production

### Testing
- No test suite currently in repo
- Recommended: Add Vitest for unit tests (Wasp supports it)
- Test payment flows in Stripe test mode

### Deployment
- Wasp supports deployment to Fly.io via `wasp deploy`
- Set production env vars in deployment platform
- Ensure DATABASE_URL points to production Postgres
- Configure `WASP_SERVER_URL` and `WASP_WEB_CLIENT_URL` for production domain

---

## Quick Reference

### Useful Commands
```bash
wasp start                 # Start dev server
wasp start db              # Start local Postgres (Docker)
wasp db migrate-dev        # Create and apply migration
wasp db studio             # Open Prisma Studio (DB GUI)
wasp clean                 # Clean .wasp build directory
wasp build                 # Production build
wasp deploy fly            # Deploy to Fly.io
```

### Important Files
- `main.wasp` - App configuration (routes, auth, operations)
- `schema.prisma` - Database schema
- `.env.server` - Environment variables (NOT committed)
- `src/server/actions.ts` - Core business logic
- `src/client/MainPage.tsx` - Landing page

### External Resources
- [Wasp Documentation](https://wasp.sh/docs)
- [Chakra UI Components](https://chakra-ui.com/docs/components)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Last Updated**: 2025-11-19
**Wasp Version**: 0.15.0
**Node Version**: 18+ recommended
