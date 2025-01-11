# Financial Data Dashboard

A Next.js application that displays financial data for Apple Inc. with filtering and sorting capabilities.

## Prerequisites

- Node.js 18+ installed
- An API key from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs/)

## Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_FMP_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Features

- Display annual financial statements for Apple Inc.
- Filter data by date range, revenue, and net income
- Sort data by different financial metrics
- Responsive design with dark/light mode support

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

You can checkout the deployed app [here](https://value-glance-emar.vercel.app/).
