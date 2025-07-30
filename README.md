# AGENT-M3c: AI-Powered Business Orchestration Platform

Welcome to AGENT-M3c, a cutting-edge Next.js application designed to revolutionize business operations through AI-enhanced features, real-time collaboration, and intelligent insights. This platform is built with a focus on performance, scalability, and security, providing a robust foundation for modern enterprises.

## Table of Contents

-   [Features](#features)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Database Setup (Supabase)](#database-setup-supabase)
    -   [Redis Setup (Upstash)](#redis-setup-upstash)
    -   [Running the Application](#running-the-application)
-   [Project Structure](#project-structure)
-   [Key Components](#key-components)
-   [API Endpoints](#api-endpoints)
-   [Testing](#testing)
-   [Deployment](#deployment)
-   [Monitoring and Logging](#monitoring-and-logging)
-   [Configuration](#configuration)
-   [Contributing](#contributing)
-   [License](#license)
-   [Support](#support)
-   [Roadmap](#roadmap)

## Features

-   **Modern Responsive Design**: A sleek, intuitive, and fully responsive user interface built with Tailwind CSS and Shadcn UI.
-   **AI-Enhanced Interactive Demo**: Experience real-time AI capabilities through an interactive demo featuring:
    -   AI Chat Assistant (`/demo`)
    -   Real-time Collaboration Simulation
    -   System Metrics & Insights
    -   Intelligent Document Analysis
    -   AI-Enhanced Video Conferencing
-   **Futuristic Dashboard**: A comprehensive dashboard for managing goals, workbooks, sessions, resources, and more.
-   **Robust API Integration**: Seamlessly connects with AI models (OpenAI via AI SDK) and other services.
-   **Performance Optimization**: Leverages Next.js features like Server Components and optimized image loading.
-   **Scalability**: Designed for growth, utilizing serverless functions and scalable database solutions.
-   **Security**: Implements best practices for secure data handling and API interactions.
-   **Error Handling & Logging**: Comprehensive error boundaries and structured logging for easy debugging and monitoring.
-   **Analytics Integration**: Basic Google Analytics integration for tracking user engagement.
-   **Comprehensive Documentation**: This README provides a detailed overview of the project.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18.x or higher)
-   npm or Yarn
-   Git
-   Vercel Account (for deployment and integrations)
-   Supabase Project (for database)
-   Upstash Redis Database (for rate limiting)
-   OpenAI API Key (for AI features)

### Installation

1.  **Clone the repository**:
    \`\`\`bash
    git clone https://github.com/your-username/agent-m3c.git
    cd agent-m3c
    \`\`\`

2.  **Install dependencies**:
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
SUPABASE_SECRET_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY" # Used for server-side operations

# Upstash Redis (for rate limiting)
KV_REST_API_URL="YOUR_UPSTASH_REDIS_REST_URL"
KV_REST_API_TOKEN="YOUR_UPSTASH_REDIS_REST_TOKEN"

# OpenAI (for AI SDK)
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# Logging (optional, set to 'debug', 'info', 'warn', 'error')
LOG_LEVEL="info"

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID="YOUR_GA_MEASUREMENT_ID"

# Admin Password for seeding (for scripts/001-seed-coach-user.sql)
ADMIN_PASSWORD="your_secure_admin_password"
\`\`\`

**Important**: For client-side environment variables (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_GA_ID`), ensure they are prefixed with `NEXT_PUBLIC_`. Server-side variables do not require this prefix.

### Database Setup (Supabase)

1.  **Create a Supabase project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Get your API keys**: Find your `Project URL` and `anon public` key in your project settings under `API`.
3.  **Run database migrations/seeds**:
    This project includes a script to seed a mock coach user. You can run it using the v0 platform's "Run Script" feature or manually if you have a local PostgreSQL client connected to your Supabase database.

    To run via v0 (recommended):
    \`\`\`bash
    # This will be executed automatically by v0 if you use the "StepsCard"
    # Otherwise, you'd typically run this via a database client or a custom script.
    # Example for local execution (requires Supabase CLI or psql):
    # psql "YOUR_SUPABASE_CONNECTION_STRING" -f scripts/001-seed-coach-user.sql
    \`\`\`

### Redis Setup (Upstash)

1.  **Create an Upstash Redis database**: Go to [Upstash](https://upstash.com/) and create a new Redis database.
2.  **Get your REST API URL and Token**: These will be used for `KV_REST_API_URL` and `KV_REST_API_TOKEN`.

### Running the Application

Once all environment variables are set and dependencies are installed:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

The application will be accessible at `http://localhost:3000`.

## Project Structure

\`\`\`
.
├── app/
│   ├── api/                  # Next.js API Routes (e.g., AI chat, demo data)
│   │   ├── ai/
│   │   │   └── chat/route.ts
│   │   │   └── aiden/orchestrate/route.ts # Aiden Engine orchestration
│   │   └── demo/
│   │       ├── collaboration/route.ts
│   │       ├── metrics/route.ts
│   │   ├── dashboard/        # Dashboard routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── goals/page.tsx
│   │   │   ├── resources/page.tsx
│   │   │   ├── sessions/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── workbooks/page.tsx
│   │   ├── demo/page.tsx     # Interactive demo page
│   │   ├── digital-assets/page.tsx
│   │   ├── executive-blog/page.tsx
│   │   ├── investor-dossier/page.tsx
│   │   ├── m3c-bootcamp/page.tsx
│   │   ├── layout.tsx        # Root layout for the application
│   │   └── page.tsx          # Landing page
├── components/
│   ├── 3d-assistant/         # 3D model components for Aiden
│   │   └── business-assistant.tsx
│   ├── aiden-assistant/      # Core Aiden AI assistant UI
│   │   └── AidenAssistant.tsx
│   ├── dashboard/            # Components specific to the dashboard
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── workbook-card.tsx
│   ├── demo/                 # Components for the interactive demo
│   │   ├── ai-chat.tsx
│   │   ├── document-analysis.tsx
│   │   ├── real-time-collaboration.tsx
│   │   ├── system-metrics.tsx
│   │   └── video-conference.tsx
│   ├── layout/               # Layout specific components (e.g., Navbar)
│   │   └── navbar.tsx
│   ├── sections/             # Reusable sections for landing page
│   │   ├── cta-section.tsx
│   │   ├── demo-section.tsx
│   │   ├── hero-section.tsx
│   │   ├── how-it-works-section.tsx
│   │   ├── pricing-section.tsx
│   │   └── testimonials-section.tsx
│   ├── shared/               # Shared UI components across the app
│   │   ├── footer.tsx
│   │   └── main-nav.tsx
│   ├── ui/                   # Shadcn UI components (customized or extended)
│   │   ├── animated-background.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── sheet.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   ├── analytics.tsx         # Google Analytics integration
│   ├── error-boundary.tsx    # React Error Boundary component
│   └── mode-toggle.tsx       # Dark/Light mode toggle
├── hooks/
│   ├── use-mobile.ts         # Hook to detect mobile view
│   └── use-toast.ts          # Hook for toast notifications
├── lib/
│   ├── ai/                   # AI-related utilities and orchestration
│   │   └── orchestrator.ts
│   ├── supabase/             # Supabase client setup
│   │   ├── client.ts
│   │   └── server.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── aiden.ts
│   │   └── index.ts
│   ├── logger.ts             # Structured logging utility
│   ├── rate-limit.ts         # API rate limiting utility
│   └── utils.ts              # General utility functions (cn for Tailwind)
├── public/                   # Static assets
│   ├── images/
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── scripts/                  # Database seeding or other utility scripts
│   └── 001-seed-coach-user.sql
├── styles/
│   └── globals.css           # Global Tailwind CSS styles
├── store/
│   └── aidenStore.ts         # Zustand store for Aiden assistant state
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
\`\`\`

## Key Components

-   **`app/layout.tsx`**: The root layout that sets up `ThemeProvider`, `Navbar`, `Footer`, `Toaster`, `Analytics`, and `AidenAssistant`.
-   **`app/page.tsx`**: The main landing page, featuring `HeroSection`, `DemoSection`, `HowItWorksSection`, `TestimonialsSection`, `PricingSection`, and `CTASection`.
-   **`app/dashboard/layout.tsx`**: Layout for all dashboard pages, including the `Sidebar` and `DashboardHeader`.
-   **`components/aiden-assistant/AidenAssistant.tsx`**: The core AI chat interface, managing interactions with the Aiden Engine.
-   **`lib/ai/orchestrator.ts`**: Backend logic for orchestrating AI responses, integrating with the AI SDK.
-   **`store/aidenStore.ts`**: Zustand store for managing the state of the Aiden assistant, including conversation history and user profile.
-   **`components/ui/animated-background.tsx`**: A dynamic background component for visual appeal.

## API Endpoints

-   `/api/ai/chat`: Basic AI chat endpoint (demonstration).
-   `/api/aiden/orchestrate`: The main endpoint for interacting with the Aiden AI Engine, handling complex interactions and orchestrating responses.
-   `/api/demo/collaboration`: Simulates real-time collaboration activities.
-   `/api/demo/metrics`: Provides mock real-time system metrics.

## Testing

This project currently includes basic functional testing through manual interaction with the UI and API endpoints. For a production application, consider adding:

-   **Unit Tests**: Using Jest or Vitest for individual functions and components.
-   **Integration Tests**: Using React Testing Library for component interactions and API integrations.
-   **End-to-End Tests**: Using Playwright or Cypress for full user flows.

## Deployment

This Next.js application is optimized for deployment on Vercel.

1.  **Connect your Git repository**: Link your GitHub, GitLab, or Bitbucket repository to Vercel.
2.  **Configure Environment Variables**: Add all necessary environment variables (from `.env.local`) to your Vercel project settings.
3.  **Deploy**: Vercel will automatically detect the Next.js project and deploy it.

## Monitoring and Logging

-   **Structured Logging**: The `lib/logger.ts` utility provides structured logging to the console. In a production environment, configure this to send logs to a centralized logging service (e.g., Vercel Logs, Datadog, Logtail).
-   **Analytics**: Basic Google Analytics integration is provided via `components/analytics.tsx`. Ensure `NEXT_PUBLIC_GA_ID` is configured.
-   **Vercel Monitoring**: Leverage Vercel's built-in monitoring for serverless function performance, real-time logs, and error tracking.

## Configuration

-   **Tailwind CSS**: Configured in `tailwind.config.ts` and `styles/globals.css`.
-   **Shadcn UI**: Components are located in `components/ui/`. You can customize them directly.
-   **AI SDK**: Configured to use OpenAI models. You can switch to other providers supported by AI SDK (e.g., Groq, Anthropic) by changing the model import in `lib/ai/orchestrator.ts`.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For any issues or questions, please open an issue on the GitHub repository or contact our support team at [support@agent-m3c.com](mailto:support@agent-m3c.com).

## Roadmap

-   Implement full user authentication and authorization.
-   Integrate with more third-party APIs (e.g., CRM, ERP systems).
-   Enhance AI capabilities with custom tools and function calling.
-   Add real-time data synchronization for collaboration features.
-   Develop a comprehensive admin panel for user and content management.
-   Expand dashboard analytics and reporting features.
