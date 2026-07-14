> **🔗 Looking for the API, Database, and WebSocket Server? [Click here to visit the LineLess Backend Repository](https://github.com/preetChaudhary04/lineless-backend)**

---

# ⚡ LineLess: Campus Virtual Queue Management System (Client)

![LineLess Frontend Banner](https://via.placeholder.com/1200x300/1e293b/f8fafc?text=LineLess+Frontend+Client)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://linelessqueue.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)
[![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)](#)

This repository contains the **Frontend React Application** for **LineLess**.

LineLess is a real-time Single Page Application (SPA) engineered to completely eradicate the friction of physical waiting lines across college and university campuses. By digitizing the queuing process, this client interface bridges the gap between campus service providers and students, ensuring a seamless, low-latency, and responsive user experience across all devices.

---

## 📖 Table of Contents

1. [Core Features](#-core-features)
2. [Tech Stack & Libraries](#-tech-stack--libraries)
3. [Architecture & State Management](#-architecture--state-management)
4. [Real-Time WebSocket Integration](#-real-time-websocket-integration)
5. [Project Structure](#-project-structure)
6. [Environment Setup](#-environment-setup)
7. [Installation & Scripts](#-installation--scripts)
8. [Vercel Deployment Guide](#-vercel-deployment-guide)

---

## ✨ Core Features

### 🎓 Dynamic Customer (Student) Interface

- **Frictionless Entry:** Centralized dashboard to view all active campus service desks (Canteen, Library, Admin).
- **Live Position Tracking:** UI automatically updates the user's exact position in line without requiring a page refresh.
- **Personal Token Hub:** A dedicated `My Tickets` view showing all active queues the user is currently participating in.

### 🏢 Protected Provider (Staff) Dashboard

- **Role-Based Rendering:** UI components dynamically render based on the authenticated user's JWT role (`CUSTOMER` vs `PROVIDER`).
- **Traffic Control Panel:** Dedicated screens to provision new service counters, pause operations, or close desks.
- **One-Click Progression:** Minimalist action buttons to call the next student in line and instantly update the active lineup.

### 🔒 Security & UX

- **Protected Routing:** Unauthenticated users are strictly locked out of the dashboard and routed back to the login gateway.
- **Seamless Session Recovery:** Application automatically re-hydrates the user session on browser refresh using secure Axios interceptors.
- **Toast & Alert Management:** Clean, contextual UI alerts for successful operations, network errors, or queue rejections.

---

## 🛠 Tech Stack & Libraries

- **Framework:** React 18
- **Build Tool:** Vite (for lightning-fast HMR and optimized builds)
- **Routing:** React Router DOM v6
- **State Management:** React Context API + Custom Hooks (`useAuth`, `useServices`, `useTickets`)
- **Network Client:** Axios (configured with dynamic request interceptors)
- **Real-Time Client:** Socket.io-client

---

## 🏗 Architecture & State Management

This frontend is built using a **Feature-Based Folder Structure**. Instead of grouping files by their type (all contexts together, all hooks together), files are grouped by their _domain_ feature (Auth, Services, Tickets) to ensure high maintainability.

### The Interceptor Pattern

To manage cross-origin authentication securely, this client utilizes **Axios Request Interceptors**. Every outgoing HTTP request automatically intercepts the call, extracts the active JWT token from LocalStorage, and injects it into the `Authorization: Bearer <token>` header, ensuring the backend always receives authenticated requests.

---

## 🔌 Real-Time WebSocket Integration

LineLess relies on **Socket.io-client** to prevent constant HTTP polling.

When a user logs in and mounts the `ServicesDashboard` or `LineManagement` screens, the client establishes a persistent WebSocket connection to the backend.

- If a Provider advances a line, the backend emits a `queue_updated` event.
- The frontend listener catches this event and instantly triggers a state update, re-rendering the queue position for all connected students with near-zero latency.

---

## 📂 Project Structure

```text
lineless-frontend/
├── public/                # Static assets (favicons, etc.)
├── src/
│   ├── assets/            # Images, global CSS (style.css)
│   ├── components/        # Reusable UI components (Navbar, LogoutPopUp)
│   ├── features/          # Feature-based domain logic
│   │   ├── auth/          # Login, Register, authApi.js, authContext.jsx
│   │   ├── services/      # ServicesDashboard, servicesApi.js, servicesContext
│   │   └── tickets/       # Ticket tracking, ticketApi.js
│   ├── layouts/           # Page wrappers (e.g., ProtectedRoute.jsx)
│   ├── App.jsx            # Main React Router configuration
│   └── main.jsx           # React DOM root render & Provider wrapping
├── .env                   # Local environment variables
├── vercel.json            # Vercel SPA routing fallback rules
├── vite.config.js         # Vite bundler configuration
└── package.json           # Dependencies and scripts
```

---

## 🔐 Environment Setup

Create a `.env` file in the root of the project. This is required for the client to know where to send Axios and Socket.io requests.

```env
# URL of the live Render backend or local Express server
VITE_BACKEND_URL=http://localhost:5000
```

---

## 💻 Installation & Scripts

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Setup Instructions

Clone the repository:

```bash
git clone https://github.com/your-username/lineless-frontend.git
cd lineless-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Available Scripts

- `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` - Compiles the application into static files inside the `dist/` folder for production deployment.
- `npm run preview` - Boots up a local web server to preview the compiled `dist/` production build.

---

## 🚀 Vercel Deployment Guide

Because this is a Single Page Application (SPA) using React Router, direct navigation or hard refreshes on nested routes (like `/services`) will return a 404 Not Found error on Vercel by default.

This project includes a `vercel.json` file at the root level to handle route rewrites automatically.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

When deploying to Vercel, simply connect your GitHub repository. Vercel will automatically read the `vercel.json` file, run the `npm run build` command, and configure the edge network to route all traffic seamlessly through your React Router!
