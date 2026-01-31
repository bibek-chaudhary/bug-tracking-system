# 🐞 Bug Tracking System

A full-stack **Bug Tracking System** built with **React + Tailwind CSS (Frontend)** and **ASP.NET Core 8 Web API + SQL Server (Backend)**.

This application allows users to report bugs, developers to manage and resolve them, and both roles to track bug progress efficiently.

---

## 🔗 Live Application

**Frontend (Vercel):**  
https://bug-tracking-system-ruddy.vercel.app

> ℹ️ Backend API is currently run **locally** using **IIS Express** for development and evaluation purposes.

---

## 🛠 Tech Stack

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core (Code-First)
- SQL Server
- ASP.NET Core Identity
- JWT Authentication
- Dependency Injection
- Clean Architecture

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Role-based protected routes

---

## 👥 Roles & Permissions

### 👤 User
- Register & Login
- Report bugs with attachments
- View own reported bugs
- Track bug status
- View bug details

### 👨‍💻 Developer
- View unassigned bugs
- Search, filter & sort bugs
- Assign bugs to self
- Update bug status
- View bug details & attachments

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Protected API endpoints
- Protected frontend routes

### 🐞 Bug Management
- Report bugs with:
  - Title
  - Description
  - Severity (Low / Medium / High)
  - Reproduction steps
  - File attachments
- Bug lifecycle:
  - Open → In Progress → Resolved → Closed

### 🔍 Search, Pagination & Filters
- Server-side pagination
- Sorting by date, severity, status
- Filtering by severity and status
- Search using meaningful fields

### 📎 Attachments
- Upload screenshots or logs
- View attachments in bug details

### 🎨 UI / UX
- Responsive UI with Tailwind CSS
- Consistent layouts
- Role-based dashboards
- Clean tables with actions

---

## 🚀 Running the Project Locally

---

## 🟢 Backend (.NET 8 API – IIS Express)

### Prerequisites
- Visual Studio 2022+
- .NET 8 SDK
- SQL Server / SQL Server Express

### Steps

1. Open **Visual Studio**
2. Open the solution:

3. Set startup project:

4. Update connection string in `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=BugTrackerDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```
🟢 Frontend (React + Tailwind)
Prerequisites

Node.js (v18+)

npm or yarn

Steps
cd frontend
npm install

Run frontend:
npm run dev

Frontend runs on:

http://localhost:5173

🌍 Deployment

Frontend: Deployed on Vercel

Backend: Run locally (IIS Express)
https://localhost:44309/

👨‍💻 Author

Bibek Chaudhary
Full-Stack Developer (React & .NET)
