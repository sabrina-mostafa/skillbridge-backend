
# SkillBridge Backend

SkillBridge is a full-stack online tutoring platform that connects students with tutors for personalized learning sessions.
This repository contains the backend REST API built with **Node.js**, **Express.js**, **TypeScript**, **Prisma**, **PostgreSQL**, and **Better Auth**.

---

## 🚀 Features

- 🔐 Authentication & Authorization
  - Email & Password Authentication
  - Google OAuth Authentication
  - Email Verification
  - Password Reset
  - Role-Based Access Control (Admin, Tutor, Student)
  - Secure Session Management using Better Auth

- 👨‍🏫 Tutor Management
  - Tutor Profile Creation
  - Professional Information
  - Category Assignment
  - Availability Management
  - Featured Tutor Support

- 🎓 Student Management
  - Student Profile
  - Learning Preferences
  - Booking History

- 📅 Booking System
  - Book Tutor Sessions
  - Booking Status Management
  - Payment Status Tracking
  - Google Meet Integration

- ⭐ Reviews & Ratings
  - Leave Reviews
  - Update/Delete Reviews
  - Automatic Tutor Rating Calculation

- 💬 Real-time Messaging
  - Conversations
  - Messages
  - Socket.IO Integration

- 📊 Admin Dashboard
  - User Management
  - Tutor Management
  - Booking Management
  - Analytics

- 📧 Email Services
  - Verification Email
  - Password Reset Email

---

# 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Better Auth
- Google OAuth
- Google Calendar API
- Socket.IO
- Nodemailer
- Zod
- PDFKit
- ExcelJS

---

# 📁 Project Structure

```
src
├── config
├── constants
├── errors
├── helpers
├── lib
├── middlewares
├── modules
│   ├── admin
│   ├── availability
│   ├── booking
│   ├── category
│   ├── conversation
│   ├── google
│   ├── message
│   ├── review
│   ├── students
│   ├── tutors
│   └── users
├── scripts
├── socket
├── types
├── utils
├── routes
├── server.ts
└── app.ts
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/your-username/skillbridge-backend.git

cd skillbridge-backend
```

---

## Install dependencies

```bash
pnpm install
```

---

## Configure Environment Variables

Create a `.env` file.

Example:

```env

DATABASE_URL=
PORT=5000

# better auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=  # Base URL of your app(Backend)

## nodemailer
APP_EMAIL = 
APP_PASS = 

# frontend
APP_URL = 

## Google OAuth
GOOGLE_CLIENT_ID= 
GOOGLE_CLIENT_SECRET= 
GOOGLE_REDIRECT_URI=

# admin user credentials
ADMIN1_USER_EMAIL= 
ADMIN1_USER_PASSWORD= 

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Generate Prisma Client

```bash
pnpm prisma generate
```

---

## Run Database Migration

```bash
pnpm prisma migrate dev
```

---

## Start Development Server

```bash
pnpm dev
```

---

## Production Build

```bash
pnpm build
```

Start production server

```bash
pnpm start
```

---

# 📌 API Modules

| Module | Description |
|---------|-------------|
| Authentication | Better Auth Authentication |
| Users | User Management |
| Students | Student Profiles |
| Tutors | Tutor Profiles |
| Categories | Subject Categories |
| Availability | Tutor Availability |
| Booking | Booking Sessions |
| Reviews | Tutor Reviews |
| Conversations | Chat Conversations |
| Messages | Chat Messages |
| Admin | Administrative Operations |

---

# 🔒 Authentication

The application uses **Better Auth** for authentication.

Supported authentication methods:

- Email & Password
- Google OAuth
- Session-based Authentication
- Email Verification
- Password Reset

---

# 👥 User Roles

There are three system roles.

- Admin
- Tutor
- Student

Each role has its own authorization rules and protected endpoints.

---

# 📅 Booking Workflow

```
Student
    │
    ▼
Browse Tutors
    │
    ▼
Select Tutor
    │
    ▼
Choose Available Time Slot
    │
    ▼
Create Booking
    │
    ▼
Tutor Accepts / Declines
    │
    ▼
Session Completed
    │
    ▼
Student Leaves Review
```

---

# 📧 Email Features

- Email Verification
- Password Reset
- HTML Email Templates

---

# 🔐 Security

- Better Auth Sessions
- HTTP-only Cookies
- Password Hashing
- Protected Routes
- Role-Based Authorization
- Input Validation using Zod

---

# 📡 Real-Time Communication

Socket.IO powers real-time messaging between students and tutors.

Features include:

- One-to-one conversations
- Instant messaging
- Live updates

---

# 📦 Scripts

| Command | Description |
|----------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build project |
| `pnpm start` | Run production server |
| `pnpm prisma generate` | Generate Prisma Client |
| `pnpm prisma migrate dev` | Run migrations |

---

# 🗄 Database

The application uses **PostgreSQL** with **Prisma ORM**.

Main entities include:

- User
- Session
- Account
- Verification
- TutorProfile
- StudentProfile
- Category
- Availability
- Booking
- Review
- Conversation
- Message

---

# 🌐 Deployment

The backend is production-ready and can be deployed on platforms such as:

- Railway
- Render
- Fly.io
- DigitalOcean
- AWS

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "feat: add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

**Sabrina Mostafa**

- GitHub: https://github.com/your-github
- LinkedIn: [Sabrina Mostafa](https://www.linkedin.com/in/sabrina-mostafa-389114207/)
