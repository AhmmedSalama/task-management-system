
# Task Management System - Backend

A production-ready Task Management REST API built with **Node.js**, **Express.js**, and **MongoDB**, featuring strict role-based access control, advanced security, filtering, pagination, and dashboard statistics.

## Features

### Authentication & Users
- User Registration & Login
- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected Routes & Centralized Error Handling
- Role-Based Authorization (Admin / Member)
- User Management (Admin restricted endpoints)

### Projects
- Create, View, Update, and Delete Projects
- Admin absolute access & Member scoped access
- Add and Remove Project Members

### Tasks
- Create, View, Update, and Delete Tasks inside projects
- Strict ownership & modification rules (Members can only modify their assigned/created tasks, Admins have full access)
- Supported fields: Title, Description, Status, Priority, Due Date, Creator, and Assignee
- Supported statuses: To Do, In Progress, and Done
- Support for filtering, pagination, search, and sorting

### Dashboard Statistics
- Real-time aggregated metrics for projects, tasks breakdown (To Do, In Progress, Done), and total system users (Admin-only).

### Security
- Helmet
- Rate Limiting
- Mongo Sanitize
- HPP (HTTP Parameter Pollution protection)
- Compression
- Express Validator

### Documentation
- Swagger API Documentation

### Testing
- Jest & Supertest

---

# Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** express-validator
- **Testing:** Jest & Supertest
- **Documentation:** Swagger UI

---

# Folder Structure


```

server
│
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── tests
│   ├── seed
│   ├── app.js
│   └── server.js
│
├── swagger.yaml
├── package.json
├── .env.example
└── README.md

```

---

# Installation & Setup

Clone Repository

```bash
git clone <repository-url>
cd server

```

Install Dependencies

```bash
npm install

```

Create Environment File

```bash
cp .env.example .env

```

Update `.env` configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

```

---

# Run Development Server

```bash
npm run dev

```

---

# Production Mode

```bash
npm start

```

---

# Seed Database

To seed initial Admin and Member test accounts:

```bash
npm run seed

```

---

# Run Tests

```bash
npm test

```

For test coverage report:

```bash
npm run test:coverage

```

---

# API Documentation

You can explore the interactive API documentation via Swagger at:

```
http://localhost:5000/api-docs

```

---

# API Endpoints Reference

## Auth

* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Authenticate user & get token
* `GET /api/auth/me` - Get current authenticated user profile

## Projects

* `GET /api/projects` - Get all accessible projects (with pagination & search)
* `GET /api/projects/:id` - Get project by ID
* `POST /api/projects` - Create a new project
* `PUT /api/projects/:id` - Update project
* `DELETE /api/projects/:id` - Delete project
* `POST /api/projects/:id/members` - Add member to project
* `DELETE /api/projects/:id/members/:userId` - Remove member from project

## Tasks

* `GET /api/tasks` - Get all accessible tasks (with pagination, filters, sorting, search)
* `GET /api/tasks/:projectId` - Get tasks by project ID
* `POST /api/tasks` - Create a new task
* `PUT /api/tasks/:id` - Update task details
* `PUT /api/tasks/:id/status` - Update task status only
* `DELETE /api/tasks/:id` - Delete task

## Users (Admin Only)

* `GET /api/users` - Get all system users
* `GET /api/users/:id/details` - Get detailed user view

## Dashboard Statistics

* `GET /api/stats` - Get dashboard metrics and task analytics

---

# Test Accounts

Generated via the seed script:

* **Admin Account:** Full access to all system resources, projects, and users management.
* **Member Account:** Scoped access to assigned projects and tasks.

---

# Author

Ahmed Salama

```

