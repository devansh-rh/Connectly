# Connectly Fast Deployment (Beginner Friendly)

This guide is made for first-time deployment and minimum confusion.

Goal:
- Backend live on Render
- Frontend live on Vercel
- Database on MongoDB Atlas

Estimated time: 20 to 35 minutes

## 1) MongoDB Atlas (10 minutes)

1. Open MongoDB Atlas and sign in.
2. Create a new project named Connectly.
3. Create a free cluster (M0).
4. Go to Security > Database Access > Add New Database User.
5. Create username and password (save both somewhere safe).
6. Go to Security > Network Access > Add IP Address > Allow Access from Anywhere.
7. Go to Database > Connect > Drivers > Node.js.
8. Copy the connection string.

It should look like this:
- mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

You will use this as MONGO_URI in Render.

## 2) Deploy Backend on Render (10 minutes)

1. Open Render and sign in using GitHub.
2. Click New + > Blueprint.
3. Select your repository: devansh-rh/Connectly.
4. Render will detect the blueprint file automatically from:
- [render.yaml](render.yaml)
5. Continue and create service.

Now set Environment Variables in Render service:
- MONGO_URI = your MongoDB Atlas connection string
- JWT_SECRET = any long random text (example: connectly_jwt_secret_2026_super_long)
- ADMIN_SECRET_KEY = any long random text
- CLIENT_URL = https://example.com (temporary, update later)

Optional for now (can skip initially):
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

6. Click Deploy.
7. Wait until status is Live.
8. Copy backend URL (example: https://connectly-api.onrender.com).

## 3) Deploy Frontend on Vercel (8 minutes)

1. Open Vercel and sign in using GitHub.
2. Click Add New Project.
3. Import repository: devansh-rh/Connectly.
4. Set Root Directory to client.
5. Add Environment Variable:
- VITE_SERVER = your Render backend URL
6. Click Deploy.
7. Copy frontend URL (example: https://connectly.vercel.app).

Vercel routing is already prepared by:
- [client/vercel.json](client/vercel.json)

## 4) Final Link Between Frontend and Backend (2 minutes)

1. Go back to Render service Environment Variables.
2. Change CLIENT_URL to your real Vercel frontend URL.
3. Save and redeploy Render backend.

## 5) Test Your Live App (5 minutes)

1. Open the Vercel URL.
2. Sign up.
3. Log in.
4. Open another browser/incognito and create second account.
5. Send messages and verify real-time chat.

## If something fails, check this first

1. VITE_SERVER in Vercel is exactly your Render backend URL.
2. CLIENT_URL in Render is exactly your Vercel frontend URL.
3. MONGO_URI is valid and copied correctly.
4. Render logs show successful server start.

## Already done in this project

1. Backend Render blueprint exists: [render.yaml](render.yaml)
2. Frontend SPA fallback exists: [client/vercel.json](client/vercel.json)
3. Backend startup safety fix done: [server/app.js](server/app.js#L29)

## Emergency copy-paste values format

Use this template in Render:

MONGO_URI=your_atlas_uri
JWT_SECRET=your_long_random_secret
ADMIN_SECRET_KEY=your_admin_secret
CLIENT_URL=https://your-vercel-app-url.vercel.app

Use this template in Vercel:

VITE_SERVER=https://your-render-backend-url.onrender.com
