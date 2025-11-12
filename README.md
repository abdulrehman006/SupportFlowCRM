# SupportFlowCRM 🎯

**Enterprise Customer Support & Ticketing System**

A modern, full-stack customer support CRM built with Next.js 16, TypeScript, and PostgreSQL, showcasing enterprise-grade development practices.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Project Overview

**SupportFlowCRM** is a professional, production-ready customer support and ticketing system designed to demonstrate modern full-stack development capabilities. Built with the latest technologies, it provides comprehensive support management with real-time dashboards, multi-user collaboration, and advanced user management.

### Key Highlights
- ✨ **Modern Tech Stack**: Next.js 16, React 19, TypeScript, Prisma, PostgreSQL
- 🎨 **Beautiful UI**: TailwindCSS + ShadCN UI components
- 🔐 **Secure**: NextAuth.js with role-based access control (Admin, Agent, User)
- 📊 **Analytics**: Real-time dashboards with interactive charts
- 👥 **User Management**: Complete admin panel for managing users, roles & permissions
- 🎯 **Production-Ready**: Deployed and fully functional

---

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Real-time analytics dashboard with ticket statistics, priority distribution, and activity feed*

### Tickets Management
![Tickets](./screenshots/tickets.png)
*Comprehensive ticket management with filtering, status updates, and detailed views*

### Ticket Details
![Ticket Details](./screenshots/ticket-details.png)
*Rich ticket detail view with comments, activity timeline, and file attachments*

### User Management (Admin)
![User Management](./screenshots/user-management.png)
*Admin panel for managing users, roles, permissions, and account status*

### Settings - Profile
![Settings Profile](./screenshots/settings-profile.png)
*User profile settings with ability to update name, email, and password*

### Contacts
![Contacts](./screenshots/contacts.png)
*Contact management with detailed customer profiles and interaction history*

### Companies
![Companies](./screenshots/companies.png)
*Company profiles with organizational information and associated contacts*

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework with server components
- **React 19** - UI library with TypeScript
- **TailwindCSS** - Utility-first CSS framework
- **ShadCN UI** - Accessible component library (Radix UI)
- **Lucide React** - Beautiful icon library
- **date-fns** - Date manipulation library

### Backend
- **Next.js API Routes** - Serverless API endpoints with Next.js 16 async params
- **Prisma ORM** - Type-safe database client
- **NextAuth.js v4** - Authentication & authorization with JWT
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL 18** - Relational database with full schema

### Developer Tools
- **TypeScript 5** - Type safety
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for Next.js

---

## ✨ Features

### 1. Authentication & Authorization ✅
- Secure login with NextAuth.js
- Role-based access control (Admin, Agent, User)
- Session management with JWT tokens
- Password hashing with bcrypt
- Protected routes and API endpoints

### 2. Dashboard & Analytics ✅
- **Real-time KPIs**: Total tickets, open tickets, resolved tickets, average response time
- **Interactive Charts**:
  - Tickets by status distribution (Pie chart)
  - Tickets by priority (Bar chart)
  - Ticket trends over time (Line chart)
- **Recent Activity Feed**: Live activity stream of system events
- **Quick Actions**: Create ticket, view reports, manage users

### 3. Ticket Management ✅
- Complete ticket lifecycle (Open → In Progress → Waiting → Resolved → Closed)
- Rich ticket creation with contact assignment
- Priority levels (Low, Medium, High, Urgent)
- Status management with color coding
- Public comments & internal notes
- Activity timeline tracking
- File attachment support
- Ticket assignment to agents

### 4. User Management (Admin Panel) ✅
- **Admin Features**:
  - View all users with statistics (tickets, comments)
  - Create new users with roles
  - Edit user details, roles, and status
  - Activate/deactivate user accounts
  - Delete users (with safety checks)
  - Search and filter users
- **Profile Management** (All Users):
  - Update name and email
  - Change password with validation
  - View current role and permissions
- **Role System**:
  - **Admin**: Full system access, user management
  - **Agent**: Ticket and contact management
  - **User**: View own tickets, limited access

### 5. Contact Management ✅
- Comprehensive contact profiles
- Email, phone, job title tracking
- Company associations
- Contact history and tickets
- Search and filtering
- CRUD operations

### 6. Company Management ✅
- Company profiles with details
- Website and industry tracking
- Associated contacts listing
- Company-wide ticket view
- Search and management

### 7. Advanced Features ✅
- Real-time session management
- Activity logging for audit trail
- Responsive mobile-first design
- Loading states and error handling
- Toast notifications
- Comprehensive null/undefined safety checks
- Next.js 16 async params compatibility

---

## 🗺️ Database Schema

### Core Tables
- **User** - Authentication, roles, and profiles
- **Contact** - Customer contact information
- **Company** - Organization management
- **Ticket** - Support tickets with full lifecycle
- **Comment** - Ticket comments (public & internal)
- **Tag** - Ticket categorization
- **Activity** - Comprehensive audit trail
- **SubscriptionPlan** - Pricing plans
- **Subscription** - User subscriptions
- **Template** - Website templates
- **Project** - User website projects
- **Invoice** - Billing and invoices

All relationships properly configured with Prisma ORM with proper constraints and indexes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/abdulrehman006/SupportFlowCRM.git
cd SupportFlowCRM

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npx prisma generate
npx prisma db push

# Seed database with sample data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Login Credentials

After seeding, you can log in with:

**Admin Account:**
- Email: `admin@supportflow.com`
- Password: `admin123`

**Agent Account:**
- Email: `agent@supportflow.com`
- Password: `agent123`

---

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5433/supportflowcrm?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```
