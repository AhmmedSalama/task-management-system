# 🚀 Full-Stack Task Management Application

A production-minded, full-stack team task board application built to demonstrate advanced software engineering principles, secure API architecture, robust database design, and a responsive user experience.

---

## 🌐 Live Demo & API Documentation

* **Frontend Application (Vercel):** https://task-management-system-ten-mu.vercel.app/
* **Backend API (Render):** https://task-management-system-fuet.onrender.com
* **Swagger API Docs (Live):** https://task-management-system-fuet.onrender.com/api-docs

---

## 📌 Executive Summary & Assessment Compliance

This project fulfills and exceeds all core functional requirements and engineering expectations outlined in the **Full Stack Node.js Technical Assessment**:

* **Delivery Window & Scope:** Completed within the specified timeframe, delivering a full-stack solution (Node.js/Express/MongoDB backend + Next.js/Tailwind frontend).
* **Architecture Quality:** Implements strict separation of concerns, centralized error handling, request sanitization, and robust validation (`express-validator`).
* **Security:** JWT-based authentication, bcrypt password hashing, helmet, rate limiting, and role-based access control (RBAC).
* **Testing:** Comprehensive automated test suite using Jest and Supertest covering core APIs and business logic.
* **Documentation:** Fully documented REST APIs via Swagger UI alongside thorough setup guidelines.

---

## 🛠️ Technology Stack

### Backend

* **Runtime & Framework:** Node.js, Express.js
* **Database & ODM:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Validation & Security:** express-validator, Helmet, Express Rate Limit, Mongo Sanitize, HPP
* **Testing:** Jest, Supertest
* **Documentation:** Swagger / OpenAPI (`swagger-ui-express`)

### Frontend

* **Framework:** Next.js (App Router)
* **Library:** React
* **Styling & UI:** Tailwind CSS, Lucide React icons, Sonner (toast notifications)
* **HTTP Client:** Axios

---

## 📁 Repository Architecture

```text
task-management/
├── client/                 # Frontend Application (Next.js & Tailwind CSS)
│   ├── src/app/            # App router pages (Auth, Dashboard, Projects, Tasks)
│   ├── src/components/     # Reusable UI, layout, forms, and feature components
│   └── src/services/       # API communication layer (Axios instances)
│
└── server/                 # Backend REST API (Node.js & Express)
    ├── src/config/         # Database and environment configurations
    ├── src/controllers/    # Business logic controllers (Auth, Projects, Tasks, Stats, Users)
    ├── src/middlewares/    # Auth protection, role restriction, and validation middlewares
    ├── src/models/         # Mongoose schemas (User, Project, Task)
    ├── src/routes/         # API routing endpoints
    ├── src/seed/           # Database seeding script for test accounts
    ├── src/tests/          # Automated Jest & Supertest test suites
    └── swagger.yaml        # OpenAPI specification file

```

---

## ⚙️ Local Setup & Installation

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Backend Setup

Navigate to the server directory, install dependencies, and configure environment variables:

```bash
cd server
npm install

```

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

```

Seed the database with initial test accounts (Admin & Member):

```bash
npm run seed

```

Start the backend development server:

```bash
npm run dev

```

*(Server runs locally on `http://localhost:5000`)*

---

### 2. Frontend Setup

Open a separate terminal, navigate to the client directory, install dependencies, and configure environment variables:

```bash
cd client
npm install

```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

Start the frontend development server:

```bash
npm run dev

```

*(Application runs locally on `http://localhost:3000`)*

---

## 📖 API Documentation & Swagger

Interactive API documentation is automatically hosted by the backend server.

**Live Documentation (Recommended):**
https://task-management-system-fuet.onrender.com/api-docs

**Local Documentation:**
Once the local server is running, open your browser at:
http://localhost:5000/api-docs

### Core API Endpoints Reference:

* **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
* **Projects:** `GET /api/projects`, `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`, `POST /api/projects/:id/members`
* **Tasks:** `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`, `PUT /api/tasks/:id/status`, `DELETE /api/tasks/:id`
* **Dashboard Stats:** `GET /api/stats` (Real-time analytics and task metrics)
* **Users (Admin):** `GET /api/users`

---

## 🧪 Automated Testing

The backend includes automated tests covering authentication, project permissions, task lifecycles, and security validations using Jest and Supertest.

To execute tests:

```bash
cd server
npm test

```

For test coverage reports:

```bash
cd server
npm run test:coverage

```

---

## 👥 Test Credentials & Roles

By running the backend seed script (`npm run seed`), default test accounts are generated for local testing. You can use the credentials below to log in directly to the live demo.

1. **Administrator Account (`Admin` Role):**

* **Email:** `admin@admin.admin`
* **Password:** `1234567899`
* Absolute access to all system projects, tasks, user management, and system-wide statistics.

2. **Member Account (`Member` Role):**

* Scoped access restricted strictly to owned or assigned projects and tasks, enforcing strict authorization barriers.

*(Note: You can also register a new account directly via the live application).*

---

## 📋 Evaluation Criteria Mapping

| Evaluation Area | Weight | Implementation Details |
| --- | --- | --- |
| **Backend Architecture & API Quality** | 25% | Modular design, centralized error handling, robust `express-validator` checks, security hardening (Helmet, Mongo Sanitize). |
| **Frontend Implementation & UX** | 20% | Responsive Next.js App Router layout, dynamic mobile sidebar, form validations, toast notifications (`sonner`), clear loading/error states. |
| **Database Design** | 15% | Normalized Mongoose schemas with proper relational references (ObjectId mapping), indexing, and seed migration scripts. |
| **Code Quality** | 15% | Clean, readable ES6+ syntax, consistent naming conventions, clear separation of concerns (MVC pattern). |
| **Testing** | 10% | Automated Jest/Supertest suite verifying core API controllers and security barriers. |
| **Documentation & Setup** | 10% | Comprehensive README files, Swagger OpenAPI UI, clear environment configuration instructions. |
| **Git Practices** | 5% | Clean commit history, structured repository organization. |

---

## Author

**Ahmed Salama**

*Full Stack Developer*

