# Resume Builder App

A full-stack **Resume Builder & Portfolio Application** built using the **MERN stack — MongoDB, Express.js, React.js, and Node.js**.

The application showcases my **skills, education, work experience, projects, achievements, certifications, and hobbies**, while providing a complete resume editing workflow.

## ✨ Features

* 📄 **Dynamic Portfolio & Resume** — View all resume sections in a structured format.
* 🔐 **Authentication & RBAC** — Role-based access with separate **Admin** and **User** permissions.
* ✏️ **Complete CRUD Operations** — Create, read, update, and delete resume information.
* 💾 **Persistent Admin Changes** — Admin edits are stored permanently in MongoDB.
* 🔄 **Backup & Restore** — Users can safely test the editing workflow without permanently modifying the admin resume.
* 🧪 **User Edit Mode** — Any user can create an account and experiment with the complete CRUD workflow; their changes are restored to the admin version after logout/refresh.
* 📥 **PDF Export** — Save the resume as a PDF directly from the application.
* 🌐 **REST APIs & CORS** — Frontend and backend communicate through RESTful APIs with CORS configuration.

## 🛠️ Tech Stack

**Frontend**

* React.js + Vite
* JavaScript
* CSS
* Context API
* Custom Hooks
* React State & Props

**Backend**

* Node.js
* Express.js
* REST APIs
* CORS
* Authentication & Authorization

**Database**

* MongoDB

## 🧠 Key Concepts

* Component-based architecture
* React Hooks & Context API
* Custom Hooks
* State & Props
* RESTful API design
* CRUD operations
* Authentication & Role-Based Access Control
* Data persistence
* Backup & Restore
* Client–Server architecture

## 🔄 Edit Workflow

```text
Admin Login
    ↓
Edit Resume
    ↓
CRUD Operations
    ↓
Save → Persisted in MongoDB
```

Users can also test the same editing experience:

```text
User Login
    ↓
Edit Resume
    ↓
CRUD Operations
    ↓
Logout / Refresh
    ↓
Admin Resume Restored
```

## 🚀 Getting Started

```bash
git clone <repository-url>
cd FUTURE_FS_01
cd resume-builder-app
npm install
npm run dev
```

Configure your MongoDB connection and other secrets using environment variables.

> **Note:** Never commit credentials, database connection strings, API keys, or `.env` files to the repository.
