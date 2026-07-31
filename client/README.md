# Task Management System - Frontend

A modern, responsive, and production-ready frontend application built with **Next.js (App Router)**, **React**, and **Tailwind CSS** for the Task Management System.

## ✨ Features

### 1. Authentication & Authorization
- Secure Login and Registration screens with validation schemas.
- Client-side auth guards preventing authenticated users from accessing login/register pages and redirecting them to the dashboard.
- Persistent session management via JWT storage.
- Role-based UI rendering (Admin vs. Member permissions).

### 2. Dashboard & Analytics
- Real-time performance metrics and task completion overview.
- Visual progress tracking bars for task statuses (To Do, In Progress, Done).
- System-wide statistics for Admin users.

### 3. Projects Management
- Comprehensive project list, creation, and detail views.
- Member management capabilities (add/remove users) with proper authorization constraints.

### 4. Tasks Management
- Centralized task board/table overview.
- Advanced filtering options by Status and Priority.
- Pagination, search, and sorting support for seamless data navigation.

### 5. UI & UX
- Fully responsive layout optimized for mobile, tablet, and desktop screens.
- Collapsible mobile sidebar with smooth slide-in animation and backdrop overlay.
- User profile display and quick Logout action integrated directly into the layout.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Library:** React
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios

---

## 📁 Folder Structure


```

client
│
├── public
└── src
├── app
│   ├── (auth)
│   │   ├── login
│   │   └── register
│   ├── admin
│   │   └── users
│   ├── dashboard
│   ├── profile
│   ├── projects
│   │   ├── create
│   │   └── [id]
│   │       └── edit
│   ├── tasks
│   │   ├── create
│   │   └── [id]
│   │       └── edit
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── providers.jsx
├── components
│   ├── auth
│   ├── common
│   ├── forms
│   ├── layout
│   ├── project
│   ├── shared
│   ├── task
│   └── ui
├── contexts
├── features
├── hooks
├── lib
├── middleware
├── services
├── styles
├── utils
└── validations

```

---

## ⚙️ Installation & Setup

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd client

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Configure Environment Variables

Create a `.env.local` file in the root of the client folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

```

### 4. Run Development Server

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Production Build

```bash
npm run build
npm start

```

---

## Author

Ahmed Salama

```