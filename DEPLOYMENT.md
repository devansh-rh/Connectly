# Connectly - MERN Stack Deployment Guide

This guide covers deploying Connectly while keeping it fully MERN:
- MongoDB: MongoDB Atlas
- Express + Node.js API: Render Web Service
- React frontend: Vercel

## Fastest Path (No Railway)

Use this if you want the simplest path without learning Railway.

1. Push your code to GitHub.
2. Deploy backend on Render using `render.yaml` from the repository root.
3. Deploy frontend on Vercel with root directory `client`.
4. Set these variables:
   - Render: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `ADMIN_SECRET_KEY`, `CLIENT_URL`
   - Vercel: `VITE_SERVER` (your Render backend URL)
5. Update Render `CLIENT_URL` to your Vercel URL and redeploy.

The project already includes:
- `render.yaml` for backend service configuration
- `client/vercel.json` for SPA routing fallback

## Prerequisites

Before you start, you'll need:

1. **GitHub Account** - Version control
2. **MongoDB Atlas Account** - Free cloud MongoDB at mongodb.com/cloud/atlas
3. **Cloudinary Account** - Free image hosting at cloudinary.com
4. **Vercel Account** - Frontend hosting at vercel.com
5. **Render or Railway Account** - Backend hosting (Railway: railway.app, Render: render.com)

## Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and create a new cluster
3. Create a database named `Connectly`
4. Add a database user with username and password
5. Whitelist your IP (or allow from anywhere in development)
6. Get your connection string: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Connectly`

## Step 2: Setup Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. Copy your credentials from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

## Step 3: Push Code to GitHub

1. Initialize git in the root directory:
```bash
git init
git add .
git commit -m "Initial commit: MERN chat application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/baat-cheet.git
git push -u origin main
```

## Step 4: Deploy Backend (Render)

1. Go to [Render](https://render.com)
2. Sign in with GitHub
3. Click **New +** → **Blueprint**
4. Select your `connectly` repository
5. Render will detect `render.yaml` and create the backend service

### Configure Environment Variables

In Render Dashboard → Service → Environment:

```
PORT=3000
NODE_ENV=PRODUCTION
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Connectly
JWT_SECRET=generate-a-long-random-string-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=https://your-app.vercel.app
ADMIN_SECRET_KEY=your-admin-secret-key
```

6. Deploy and wait for a public URL like `https://connectly-api.onrender.com`

If you use Blueprint, build/start/root settings are taken from `render.yaml` automatically.

## Step 5: Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
2. Click "Import Project" → Select your `connectly` repository
4. Configure:
   - **Root Directory:** `client`
   - **Framework:** Vite (Vercel auto-detects)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Add Environment Variables

In Vercel GUI:
```
VITE_SERVER=https://connectly-api.onrender.com
```

(Replace with your actual Render backend URL)

5. Click Deploy
6. Wait for deployment to complete
7. Your app is live at the Vercel URL!

## LocalDevelopment (After Deployment)

To run locally:

### Backend

```bash
cd server
npm install
# Create .env with your credentials
npm run dev
```

### Frontend

```bash
cd client
npm install
# Create .env with VITE_SERVER=http://localhost:3000
npm run dev
```

Your app will run at `http://localhost:5173`

##Verify Deployment

1. Visit your Vercel URL in browser
2. Sign up or login
3. Test real-time features (chat, notifications)
4. Check admin panel at `/admin`

## Troubleshooting

### "Cannot connect to server"
- Verify `VITE_SERVER` env var in Vercel matches your Render URL
- Check Render backend is deployed and running
- Check CORS settings in backend config

### "Socket.IO not connecting"
- Ensure backend is using proper CORS origins
- Check browser console for WebSocket errors
- Verify CLIENT_URL env var includes "https://"

### "Image uploads failing"
- Verify Cloudinary credentials are correct
- Check API key and secret match your account
- Ensure Cloudinary upload preset is set to unsigned

### Build fails on Vercel
- Check that Vite config is correct
- Verify all dependencies are in package.json
- Run `npm run build` locally to test

## Update Deployment

### Push New Code

```bash
git add .
git commit -m "your commit message"
git push origin main
```

- **Vercel** auto-redeploys on push
- **Render** auto-redeploys on push (if connected)

## Environment Variables Reference

### Required (Server)

| Variable | Example | Source |
|----------|---------|--------|
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `JWT_SECRET` | Long random string | Generate yourself |
| `CLOUDINARY_CLOUD_NAME` | `djq...` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | `123456` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | `secret_key` | Cloudinary Dashboard |
| `CLIENT_URL` | `https://app.vercel.app` | Your Vercel URL |

### Optional (Server)

| Variable | Default | Use |
|----------|---------|-----|
| `PORT` | 3000 | Local dev port |
| `NODE_ENV` | PRODUCTION | Environment type |
| `ADMIN_SECRET_KEY` | random | Admin panel access |

### Client

| Variable | Example |
|----------|---------|
| `VITE_SERVER` | Your Render backend URL |

## Next Steps

1. **Custom Domain:** In Vercel settings, add your domain
2. **Performance:** Monitor frontend/backend logs
3. **Scaling:** If needed, upgrade Render/Railway plan
4. **Database:** Add backups in MongoDB Atlas

## Security Tips

- Rotate JWT_SECRET periodically
- Don't commit `.env` files
- Use strong ADMIN_SECRET_KEY
- Enable CORS only for your domain
- Keep dependencies updated: `npm audit`

## Support

For issues:
- Check logs in Vercel → Deployments → Failed deployment
- Check logs in Render → Service → Logs tab
- Review MongoDB Atlas connection metrics
- Test local setup first before debugging deployment

Good luck with your deployment! 🚀
