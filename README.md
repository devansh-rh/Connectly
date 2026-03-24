# Connectly - Real-time Chat Application

A full-stack **MERN** (MongoDB, Express, React, Node.js) chat application with real-time messaging, user authentication, and an admin dashboard. Production-ready with modern UI, responsive design, and comprehensive admin controls.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-ISC-green)
![Deployment](https://img.shields.io/badge/Deployment-Vercel_%2B_Render-orange)

## Overview

Connectly is a modern chat application that allows users to:
- Create accounts and authenticate securely
- Send real-time messages to friends
- Create and manage group chats
- Search for other users
- Receive notifications
- Upload and share files
- Access an admin dashboard for system management

**Tech Stack:**
- **Frontend:** React 18 + Redux Toolkit + Material-UI + Socket.IO
- **Backend:** Express.js + Node.js + Socket.IO
- **Database:** MongoDB
- **Storage:** Cloudinary (image uploads)
- **Authentication:** JWT + Cookies

## Project Structure

```
.
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── redux/             # State management
│   │   ├── constants/         # Config constants
│   │   ├── utils/             # Utilities
│   │   └── lib/               # Helper libraries
│   ├── package.json
│   ├── vite.config.js
│   └── README.md              # Frontend docs
│
├── server/                    # Express backend
│   ├── controllers/           # Route handlers
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── middlewares/           # Express middlewares
│   ├── constants/             # Configuration
│   ├── lib/                   # Helper functions
│   ├── utils/                 # Utility functions
│   ├── app.js                 # Express app entry
│   ├── package.json
│   └── .env.example           # Environment template
│
├── DEPLOYMENT.md              # Deployment guide
├── package.json               # Root package (if using workspaces)
└── README.md                  # This file
```

## Quick Start

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Vercel & Render/Railway accounts (for deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/connectly.git
cd connectly
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - MONGO_URI (from MongoDB Atlas)
# - JWT_SECRET (generate a strong key)
# - Cloudinary credentials
# - CLIENT_URL (http://localhost:5173 for dev)

# Start development server
npm run dev
```

Server runs on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env:
# VITE_SERVER=http://localhost:3000

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Test the App

1. Open `http://localhost:5173` in your browser
2. Click "Sign Up Instead"
3. Create an account (upload an avatar)
4. Create another account (in a different tab) to test messaging
5. Send messages and test real-time features

## Key Features

### User Features
✅ User authentication with JWT
✅ Real-time messaging with Socket.IO
✅ Groups and individual chats
✅ User search and friend requests
✅ Online status and typing indicators
✅ Message notifications
✅ Profile management
✅ File/Image sharing via Cloudinary

### Admin Features
✅ User management
✅ Chat management
✅ Message analytics
✅ System statistics

## 🔧 Tech Highlights

### Architecture & Design Patterns
- **State Management:** Redux Toolkit for predictable, scalable state management across the app
- **Real-time Communication:** Socket.IO for bidirectional event-driven messaging with auto-reconnection
- **API Integration:** Axios with Redux async thunks for centralized API request handling
- **Component Architecture:** React functional components with custom hooks for reusable logic
- **Responsive Design:** Tailwind CSS + Material-UI for mobile-first, accessible UI

### Security Implementation
- **Authentication:** JWT tokens with HTTP-only, Secure, SameSite cookies
- **CORS Protection:** Dynamic origin validation with wildcard Vercel domain support for easy deployment
- **Password Security:** bcrypt hashing for secure password storage
- **Admin Authorization:** Secret key validation for protected admin routes

### Performance & UX
- **Build Tool:** Vite for fast development server and optimized production builds
- **Real-time Indicators:** Typing status, online presence, message read receipts
- **File Handling:** Cloudinary integration for scalable image/file storage
- **Notification System:** Real-time push notifications via Socket.IO events
- **Modern UI:** Dark theme with purple/cyan gradients, glass morphism effects, smooth animations

### DevOps & Deployment
- **Frontend:** Vercel with automatic Git deployments
- **Backend:** Render with environment-based configuration
- **Database:** MongoDB Atlas with Atlas Search capabilities
- **Environment Management:** Multi-environment setup (development, staging, production)

## Available Scripts

### Frontend (`client/`)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint checks
npm run preview  # Preview production build
```

### Backend (`server/`)

```bash
npm start        # Start production server
npm run dev      # Start with nodemon (development)
npm run seed     # Seed database with sample data
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=DEVELOPMENT

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/Connectly

# Authentication
JWT_SECRET=your-super-secret-key-here
ADMIN_SECRET_KEY=your-admin-secret-key

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_SERVER=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/v1/user/new` - Register user
- `POST /api/v1/user/login` - Login user
- `GET /api/v1/user/logout` - Logout user
- `GET /api/v1/user/me` - Get current user

### Users
- `GET /api/v1/user/search?name=query` - Search users
- `GET /api/v1/user/friends` - Get friends list
- `GET /api/v1/user/notifications` - Get notifications
- `PUT /api/v1/user/sendrequest` - Send friend request
- `PUT /api/v1/user/acceptrequest` - Accept friend request

### Chats
- `GET /api/v1/chat/my` - Get user's chats
- `POST /api/v1/chat/new` - Create new chat/group
- `GET /api/v1/chat/:chatId` - Get chat details
- `PUT /api/v1/chat/:chatId` - Update chat name
- `DELETE /api/v1/chat/:chatId` - Delete chat
- `PUT /api/v1/chat/addmembers` - Add group members
- `PUT /api/v1/chat/removemember` - Remove group member

### Messages
- `GET /api/v1/chat/message/:chatId?page=1` - Get messages (paginated)
- `POST /api/v1/chat/message` - Send message with attachments

## Socket.IO Events

### Client → Server
- `NEW_MESSAGE` - Send a message
- `START_TYPING` - User is typing
- `STOP_TYPING` - User stopped typing
- `CHAT_JOINED` - User joined chat
- `CHAT_LEAVED` - User left chat

### Server → Client
- `NEW_MESSAGE` - Receive message
- `NEW_MESSAGE_ALERT` - Message notification
- `START_TYPING` - Someone is typing
- `STOP_TYPING` - Someone stopped typing
- `ONLINE_USERS` - List of online users

## Deployment

Complete deployment instructions available in [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Summary:**
1. Deploy frontend to **Vercel**
2. Deploy backend to **Railway** or **Render**
3. Configure environment variables
4. Connect MongoDB Atlas
5. Setup Cloudinary integration

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed step-by-step guide.

## Database Schema

### User
```
{
  _id: ObjectId,
  name: String,
  username: String (unique),
  password: String (hashed with bcrypt),
  bio: String,
  avatar: {
    public_id: String,
    url: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Chat
```
{
  _id: ObjectId,
  name: String,
  groupChat: Boolean,
  creator: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```
{
  _id: ObjectId,
  content: String,
  sender: ObjectId (ref: User),
  chat: ObjectId (ref: Chat),
  attachments: [{
    public_id: String,
    url: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Request
```
{
  _id: ObjectId,
  sender: ObjectId (ref: User),
  receiver: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only secure cookies
- CORS protection
- Input validation with express-validator
- Socket.IO authentication middleware
- Admin secret key for sensitive operations

## Performance Optimizations

- Redux Toolkit for efficient state management
- RTK Query for smart data fetching and caching
- Socket.IO namespaces for organized real-time events
- MongoDB indexing on frequently queried fields
- Cloudinary for optimized image delivery
- Code splitting in React frontend

## 🚀 Deployment

The application is configured for easy deployment to production platforms:

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `VITE_SERVER=your-backend-url`
4. Deploy automatically on push

**Current:** https://connectly-app.vercel.app (or your deployed URL)

### Backend Deployment (Render)
1. Create Render service linked to GitHub repository
2. Configure environment variables:
   ```
   MONGO_URI, JWT_SECRET, ADMIN_SECRET_KEY,
   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
   CLIENT_URL
   ```
3. Deploy with `npm start` as start command

**Current:** Deployed on Render (check DEPLOYMENT.md for details)

### Database (MongoDB Atlas)
- Cluster created and configured
- Network access whitelisted
- Regular backups enabled
- Connection pooling configured

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Troubleshooting

### Can't connect to MongoDB
- Verify connection string in `.env`
- Check IP is whitelisted in MongoDB Atlas
- Ensure database name is "Connectly"

### Images not uploading
- Verify Cloudinary credentials in `.env`
- Check Cloudinary account is not quota-limited
- Ensure file is under upload size limit

### Socket.IO not connecting
- Check CORS settings in `server/app.js`
- Verify `CLIENT_URL` env var is correct
- Check browser console for WebSocket errors

### Build fails
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` to see detailed errors

## Contributing

Found a bug or want to add features?
1. Create a new branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## License

ISC License - See package.json for details

## Support

For issues and questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review [client/README.md](./client/README.md) for frontend questions
- Check MongoDB Atlas docs for database issues
- Verify Cloudinary API documentation for upload issues

## Roadmap

- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Message encryption
- [ ] Voice/Video calls
- [ ] Message search
- [ ] Custom themes
- [ ] Dark mode
- [ ] Mobile app (React Native)

---

**Made with ❤️ using MERN Stack**

Last Updated: March 2026
