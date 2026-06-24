# Food Ordering Web Application

A modern, full-stack for a food ordering platform, featuring seamless bilingual support (English/Arabic), real-time order tracking, and an admin dashboard. Built with Next.js App Router and Zustand for local state persistence.

## Features

- **Bilingual Interface**: Full English and Arabic localization with automatic RTL (Right-to-Left) layout switching.
- **Authentication System**: User registration and login flows with simulated network latency.
- **Menu Browsing**: Categorized food items with localized descriptions and imagery.
- **Shopping Cart**: Add/remove items, adjust quantities, and include item-specific special instructions.
- **Checkout Process**: Support for multiple payment methods (Cash, Card, Wallet) and delivery address collection.
- **Interactive Order Tracking**: Visual timeline showing real-time order status updates.
- **Admin Dashboard**: Dedicated interface for admins to view and manage all customer orders.
- **Dark/Light Mode**: Full theme customization support using `next-themes`.
- **Mock Backend**: State persistence simulating a real-world API experience without needing a live database.

## Screenshots

*(Placeholder for Screenshots)*
- `![Homepage](placeholder-url)`
- `![Menu Details](placeholder-url)`
- `![Checkout Flow](placeholder-url)`
- `![Order Timeline](placeholder-url)`
- `![Admin Dashboard](placeholder-url)`

## Demo

* **Live Demo URL**: [food-ordering-web-2026.netlify.app]
* **GitHub Repository URL**: [https://github.com/mustafa3issa/Food-Ordering-Web-Application]

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4, shadcn/ui, Lucide Icons
- **State Management**: Zustand (with Persist Middleware)
- **Internationalization**: next-intl
- **Forms & Validation**: React Hook Form, Zod
- **Type Checking**: TypeScript

## Architecture

- **Project Structure**: The application uses the Next.js App Router (`src/app/[locale]`) to handle routing and dynamic language segments.
- **Feature-based Architecture**: Code is logically grouped by domain under `src/features/` (admin, auth, cart, checkout, menu, order) to ensure modularity, making the codebase highly scalable and easier to maintain.
- **State Management Approach**: `Zustand` is utilized for global state across different slices (Auth, Cart, Menu, Orders). The `persist` middleware maps these stores to `localStorage`, acting as a mock database for a fully functional client-side prototype.
- **Internationalization Approach**: Managed by `next-intl`. The `[locale]` dynamic segment intercepts routes, serving localized content from JSON dictionaries. The root layout dynamically updates the HTML `dir` attribute and swaps font variables (Inter/Noto Sans Arabic) for seamless LTR/RTL transitions.

## Folder Structure

```text
src/
├── app/
│   └── [locale]/         # Dynamic locale routing
│       ├── (admin)/      # Admin routes
│       ├── (auth)/       # Authentication routes
│       ├── (shop)/       # Customer-facing shop routes
│       ├── layout.tsx    # Root layout (handles LTR/RTL and i18n providers)
│       └── page.tsx      # Landing page
├── components/
│   └── ui/               # Reusable UI primitives (shadcn/ui)
├── features/             # Feature-based domain logic
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── menu/
│   └── order/
├── i18n/                 # Localization configurations
│   ├── messages/
│   │   ├── ar.json
│   │   └── en.json
│   ├── request.ts
│   └── routing.ts
├── stores/               # Zustand state slices
│   ├── auth-store.ts
│   ├── cart-store.ts
│   ├── menu-store.ts
│   └── order-store.ts
└── types/                # Global TypeScript definitions
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- npm, yarn, or pnpm

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Demo Credentials

You can test the application using the mock authentication system. 

* **Customer Account**
  - Email: `user@example.com` (or register any new email)
  - Role: Customer (Default)
* **Admin Account**
  - Email: `admin@example.com` 
  - Role: Admin (Selectable/Mocked during the prototype Login Flow)

## User Roles

- **Customer**: Can browse the localized menu, manage their shopping cart, add special instructions, proceed through checkout with various payment methods, and track their order status via a live timeline.
- **Admin**: Has access to an administrative dashboard to view the global system order queue and sequentially update order statuses (e.g., Pending → Preparing → Out for Delivery → Delivered) to update the customer's timeline.

## Internationalization

The app features full bilingual support for English (LTR) and Arabic (RTL). This is implemented using `next-intl` alongside the Next.js App Router. The URL determines the active language (e.g., `/en/` or `/ar/`). The root layout automatically injects the correct `dir` attribute (`ltr` or `rtl`) and swaps fonts (`Inter` for English, `Noto Sans Arabic` for Arabic) to ensure typography remains authentic and UI elements mirror correctly across the entire platform.

## Order Workflow

1. **Cart Selection**: Users browse the menu and add items to their cart, optionally providing special instructions for each item.
2. **Checkout**: Users provide delivery details and select a payment method (Cash, Card, or Wallet).
3. **Creation**: An order is generated and saved to the Zustand persistent store with a default status of `pending`.
4. **Tracking**: The customer is redirected to an order tracking page displaying a visual timeline of their order's progress.
5. **Fulfillment**: An Admin logs in, views the global order queue, and updates the status (`confirmed` → `preparing` → `ready` → `out_for_delivery` → `delivered`). These changes instantly reflect on the customer's tracking timeline.

## Design Decisions

- **Client-Side Mocking**: To enable rapid prototyping and testing without a backend, network delays are simulated (via Promises), and relational data (Users, Orders, Menu Items) is stitched together client-side using Zustand's `persist` middleware.
- **Feature Slices**: Structuring the `src/features/` folder ensures that components, hooks, and localized logic related to a specific domain (like checkout) remain co-located, reducing cognitive load when scaling the codebase.
- **Tailwind + shadcn/ui**: Chosen for rapid UI iteration, deep customization, accessibility out-of-the-box, and maintaining a lightweight bundle size compared to heavier, inflexible component libraries.

## Development Approach

This project was built using an AI-assisted development workflow. While AI tools accelerated code generation and boilerplate scaffolding, the core architecture, state integration, testing, and final validation were performed manually to ensure a high-quality, production-ready standard.

## Future Improvements

- **Backend Integration**: Replace Zustand persistent storage with a real backend database (e.g., PostgreSQL via Prisma or Supabase).
- **Payment Gateway**: Integrate Stripe or PayTabs for processing live card transactions.
- **Live Tracking**: Implement WebSocket connections for real-time status updates between the admin and customers.
- **Map Integration**: Add Google Maps or Mapbox for precise delivery address pinning.
- **Driver Application**: Introduce a third 'Driver' role for handling real-world delivery logistics.

## Author

**[Mustafa Issa]**
- GitHub: [@mustafa3issa](https://github.com/mustafa3issa)
- LinkedIn: [Mustafa Issa](https://linkedin.com/in/mustafa3issa)
