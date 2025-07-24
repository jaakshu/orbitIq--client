# OrbitIQ Client

## Overview
OrbitIQ Client is a full-stack web application designed to provide a modular workflow builder and file processing platform. The project is split into a clear **frontend** and **backend** architecture, enabling scalable development and easy maintenance.

---

## Project Structure

```
OrbitIQ---client/
  backend/      # Backend API, database, and server logic
  frontend/     # Next.js frontend (UI, pages, components)
```

### **Backend**
- **Location:** `backend/`
- **Purpose:** Handles API endpoints, authentication, workflow execution, and database operations.
- **Key Technologies:**
  - **Node.js** (assumed, for API routes)
  - **Prisma** (ORM for database access)
  - **SQLite** (default database)
  - **TypeScript**
- **Main Folders:**
  - `api/` — API route handlers (e.g., authentication, workflow execution)
  - `lib/` — Utility functions, types, and Prisma client
  - `prisma/` — Database schema and migrations

### **Frontend**
- **Location:** `frontend/`
- **Purpose:** Provides the user interface for building workflows, previewing files, and interacting with the backend.
- **Key Technologies:**
  - **Next.js** (React framework)
  - **TypeScript**
  - **Tailwind CSS** (utility-first CSS framework)
  - **Radix UI** (UI primitives)
  - **Recoil** (state management)
  - **React Flow** (workflow/node editor)
  - **Framer Motion** (animations)
  - **Zod** (schema validation)
  - **Prisma Client** (for frontend API calls)
- **Main Folders:**
  - `app/` — Next.js App Router (entry points, layouts, providers)
  - `components/` — UI components, workflow nodes, and custom UI
  - `hooks/` — Custom React hooks
  - `lib/` — (if present) frontend utilities

---

## Features
- **User Authentication:** Secure sign-in and sign-up flows (NextAuth.js, Prisma, bcryptjs)
- **Workflow Builder:** Drag-and-drop node-based workflow editor (React Flow)
- **File Processing:** Preview, convert, and process files through custom nodes
- **UI Components:** Modern, accessible UI with Radix UI and Tailwind CSS
- **State Management:** Recoil for global state
- **Database:** Prisma ORM with SQLite (default, can be changed)
- **API:** RESTful endpoints for workflow execution, saving, and loading

---

## Setup Instructions

### 1. **Clone the Repository**
```sh
git clone <repo-url>
cd OrbitIQ---client
```

### 2. **Install Frontend Dependencies**
```sh
cd frontend
npm install
```

### 3. **Start the Frontend**
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### 4. **Setup and Run Backend (if needed)**
- If your backend uses Node.js, create a `package.json` in `backend/` and add your start scripts.
- Run backend server in a separate terminal:
```sh
cd backend
npm install # if package.json exists
npm run dev # or your backend start command
```

### 5. **Database Migrations (if needed)**
```sh
cd backend
npx prisma migrate dev
```

---

## Technologies & Libraries
- **Frontend:**
  - Next.js, React, TypeScript, Tailwind CSS, Radix UI, Recoil, React Flow, Framer Motion, Zod
- **Backend:**
  - Node.js, TypeScript, Prisma, SQLite, bcryptjs, NextAuth.js

---

## Folder Details
- **frontend/app/**: Next.js App Router entry (layout, pages, providers)
- **frontend/components/**: UI and workflow components
- **frontend/hooks/**: Custom React hooks
- **frontend/globals.css**: Global styles
- **backend/api/**: API route handlers
- **backend/lib/**: Utilities and Prisma client
- **backend/prisma/**: Database schema and migrations

---

## How It Works
- **Frontend** communicates with **backend** via API endpoints for authentication, workflow execution, and data persistence.
- **Users** can build workflows visually, process files, and manage their data securely.
- **Database** stores user data, workflows, and authentication info via Prisma ORM.

---

## Contribution
1. Fork the repo and create a feature branch.
2. Make your changes and commit with clear messages.
3. Open a pull request for review.

---

## License
This project is licensed under the MIT License. 
