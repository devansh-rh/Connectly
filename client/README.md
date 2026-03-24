# Baat Cheet - MERN Chat Application

A real-time chat application built with **MongoDB, Express, React, and Node.js**.

## Features

- User authentication with JWT
- Real-time messaging via Socket.IO
- Group chat support
- User search and friend requests
- Message history and notifications
- Admin dashboard for user and chat management
- File uploads with Cloudinary
- Responsive Material-UI interface

## Prerequisites

- Node.js v16+
- MongoDB account (Atlas or local)
- Cloudinary account for image uploads
- npm or yarn

## Local Development Setup

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file using `.env.example` and fill in all required variables:
```bash
cp .env.example .env
```

4. Start the server:
```bash
npm run dev  # with nodemon
npm start    # production
```

Server will run on `http://localhost:3000` (or your configured PORT)

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and configure:
```bash
cp .env.example .env
```

Update `VITE_SERVER` to match your backend URL.

4. Start dev server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Required Environment Variables

### Server (.env)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (PRODUCTION/DEVELOPMENT)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `CLIENT_URL`: Frontend URL for CORS
- `ADMIN_SECRET_KEY`: Admin panel secret key

### Client (.env)
- `VITE_SERVER`: Backend API base URL (e.g., `http://localhost:3000`)

## Project Structure

```
client/
  src/
    components/      - Reusable React components
    pages/           - Application pages
    redux/           - State management with Redux Toolkit
    constants/       - Configuration constants
    utils/           - Utility functions
    lib/             - Helper libraries

server/
  controllers/       - Route handlers
  models/           - MongoDB schemas
  routes/           - API routes
  middlewares/      - Express middlewares
  lib/              - Helper utilities
  constants/        - Server configuration
```

## Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import repo in Vercel dashboard
3. Set root directory to `client`
4. Add environment variables
5. Deploy

**Backend (Railway or Render):**
1. Create new project
2. Connect GitHub repo
3. Add environment variables
4. Deploy

### Option 2: Full Vercel Deployment

Due to Vercel's serverless nature and Socket.IO requirements, consider:
- Deploy frontend to Vercel
- Deploy backend to Railway, Render, or Heroku configured for Node.js + Socket.IO

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start server (production)
- `npm run dev` - Start with nodemon (development)

## Technology Stack

**Frontend:**
- React 18
- Redux Toolkit + RTK Query
- Material-UI
- Socket.IO Client
- Vite

**Backend:**
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary
- Bcrypt for password hashing

## License

ISC
