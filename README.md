# Code Explainer

Paste code → get line-by-line explanations, summary, complexity, issues, refactors, tests.

## Setup

```bash
npm i
npm i openai zod
```

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

## Dev

```bash
npm run dev
```

Open http://localhost:3000

## Deploy

- Push to GitHub, import in Vercel, set `OPENAI_API_KEY` in Project → Settings → Environment Variables.
- Redeploy.

## How to Use

1. Select Language (or keep Auto-detect) and Depth (Detailed recommended).
2. Paste your code into the textarea (or click Use sample).
3. Click Explain Code.
4. Read the Summary, Complexity (Big-O), and check By Line explanations.
5. Click a code line number to focus its explanation; or click a By Line item to highlight the code.
6. Copy the Summary or Complexity for notes. Your code is not stored.

---

This template uses: Next.js App Router, TypeScript, Tailwind. API at `/api/explain` validates via zod, calls OpenAI when `OPENAI_API_KEY` exists, otherwise returns a mock JSON.# Project Title

A short description of your project.

---

## Tech Stack

- …
- …
- …

---

## How to Run This App

1. Clone the repository:

   ```bash
   git clone https://github.com/username/project-name.git
   ```

2. Navigate into the project folder:

   ```bash
   cd project-name
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

---

## Demo / Deployment

👉 [Live Demo](https://example-demo.com)

---
