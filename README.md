# Connectly - Real-Time MERN Chat Platform

Connectly is a full-stack chat platform built with the MERN stack, designed to demonstrate production-style engineering across authentication, real-time systems, scalable data modeling, and admin tooling.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![Realtime](https://img.shields.io/badge/Realtime-Socket.IO-orange)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-purple)

## Why This Project Matters

This project showcases end-to-end product engineering, not just UI screens:

- Real-time private and group chat with Socket.IO event flows
- Secure JWT auth with HTTP-only cookies and role-protected admin routes
- Media/file sharing pipeline with Cloudinary
- Scalable state management using Redux Toolkit + RTK Query
- Deployment-ready architecture with Vercel (client) and Render (server)

## Live Demo

- Frontend: https://connectly-app.vercel.app
- Backend API: Add your Render URL here

## Recruiter Snapshot

- Role target: Full-stack / MERN developer
- Project scope: Multi-user real-time messaging platform
- Core engineering focus: Auth, sockets, API design, state management, deployment
- Production concerns covered: CORS policy, secure cookies, env-based config, error middleware

## Tech Stack

### Frontend

- React 18
- Vite
- Material UI
- Redux Toolkit + RTK Query
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose
- JWT + bcrypt
- Cloudinary + Multer

### DevOps / Platform

- Vercel (frontend)
- Render (backend)
- MongoDB Atlas (database)

## Core Features

### User Features

- Account registration and login
- One-to-one and group conversations
- Friend request workflow
- Real-time new-message delivery
- Typing indicators and online user tracking
- Notification panel for pending requests/events
- Profile and avatar management
- Attachment and media upload support

### Admin Features

- Admin login with server-side secret key verification
- User management dashboard
- Chat and message management views
- Platform-level usage analytics widgets

## Architecture Overview

### Client Layer

- Component-driven React UI organized by domain modules
- Centralized global state in Redux Toolkit
- RTK Query for API requests, caching, and invalidation
- Socket context/provider for real-time event subscriptions

### Server Layer

- REST APIs under versioned route namespaces
- Dedicated controllers for user/chat/admin flows
- Middleware chain for auth, validation, upload, and error handling
- Socket auth middleware validating cookie-based tokens

### Data Layer

- MongoDB collections for users, chats, messages, and requests
- Mongoose models with schema validation and relations
- Pagination support for message history fetching

## Project Structure

```text
.
|- client/
|  |- src/
|  |  |- components/
|  |  |- pages/
|  |  |- redux/
|  |  |- constants/
|  |  |- hooks/
|  |  \- lib/
|  \- package.json
|- server/
|  |- controllers/
|  |- middlewares/
|  |- models/
|  |- routes/
|  |- utils/
|  \- package.json
|- DEPLOYMENT.md
|- DEPLOY_FAST_TRACK.md
\- README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas account
- Cloudinary account

### 1. Clone and Install

```bash
git clone https://github.com/devansh-rh/Connectly.git
cd Connectly
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs at http://localhost:3000

### 3. Frontend Setup

```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```

Frontend runs at http://localhost:5173

## Environment Variables

### Server (.env)

```env
PORT=3000
NODE_ENV=DEVELOPMENT
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
ADMIN_SECRET_KEY=your_admin_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### Client (.env)

```env
VITE_SERVER=http://localhost:3000
```

## API Surface (High-Level)

### Auth and User

- POST /api/v1/user/new
- POST /api/v1/user/login
- GET /api/v1/user/logout
- GET /api/v1/user/me
- GET /api/v1/user/search
- GET /api/v1/user/friends
- GET /api/v1/user/notifications

### Chat and Message

- GET /api/v1/chat/my
- POST /api/v1/chat/new
- GET /api/v1/chat/:chatId
- PUT /api/v1/chat/:chatId
- DELETE /api/v1/chat/:chatId
- GET /api/v1/chat/message/:chatId
- POST /api/v1/chat/message

### Admin

- Admin auth and protected management endpoints under /api/v1/admin/*

## Socket Events

### Client -> Server

- NEW_MESSAGE
- START_TYPING
- STOP_TYPING
- CHAT_JOINED
- CHAT_LEAVED

### Server -> Client

- NEW_MESSAGE
- NEW_MESSAGE_ALERT
- START_TYPING
- STOP_TYPING
- ONLINE_USERS

## Security and Quality Notes

- Password hashing via bcrypt pre-save hooks
- JWT verification in HTTP and socket middleware
- HTTP-only cookie usage for auth token transport
- Configurable CORS origin validation for local and deployed frontends
- Structured error handling with centralized middleware

## Deployment

Deployment guides are included here:

- [DEPLOY_FAST_TRACK.md](./DEPLOY_FAST_TRACK.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [LOCAL_MONGODB_SETUP.md](./LOCAL_MONGODB_SETUP.md)
- [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

## Roadmap

- Email verification flow
- Two-factor authentication
- End-to-end message encryption
- Voice/video calling
- Full-text message search
- React Native companion app

## Contact

If you are evaluating this project for hiring, feel free to review the commit history and architecture decisions in the codebase.

Built by Devansh using the MERN stack.
