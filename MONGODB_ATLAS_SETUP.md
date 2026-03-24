# Connectly - MongoDB Atlas Setup Guide

Follow these steps to get a free MongoDB database in the cloud for Connectly.

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in:
   - Email
   - Password
   - Full Name
4. Click **"Create your Atlas account"**
5. Check your email and verify your account

## Step 2: Create a Cluster

1. After login, you'll see the MongoDB Atlas dashboard
2. Click **"Create"** (or "Build a Cluster")
3. Choose **"Free"** tier (M0 Cluster)
4. Select your region (choose closest to you)
5. Click **"Create Cluster"** (takes 2-3 minutes to deploy)

## Step 3: Create Database User

1. In left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Fill in:
   - **Username**: `connectlyuser`
   - **Password**: Generate password (copy it somewhere safe)
   - **Database User Privileges**: Read and write to any database
4. Click **"Add User"**

## Step 4: Whitelist IP Address

1. In left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - In production, you'd add specific IPs
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go back to **"Clusters"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"** option
4. Select **"Node.js"** driver, version 4.1 or later
5. Copy the connection string
6. It looks like: `mongodb+srv://connectlyuser:PASSWORD@cluster0.xxxxx.mongodb.net/Connectly?retryWrites=true&w=majority`

## Step 6: Replace Password in Connection String

The connection string has `<password>` placeholder.

Replace it with your actual password from Step 3.

**Example:**
```
# Before:
mongodb+srv://connectlyuser:<password>@cluster0.xxxxx.mongodb.net/Connectly?retryWrites=true&w=majority

# After (with password "MyP@ssw0rd"):
mongodb+srv://connectlyuser:MyP@ssw0rd@cluster0.xxxxx.mongodb.net/Connectly?retryWrites=true&w=majority
```

## Step 7: Update .env File

Copy your final connection string and paste it into your `.env` file:

**File: `server/.env`**

Change this line:
```
MONGO_URI=mongodb://localhost:27017/Connectly
```

To your Atlas URL:
```
MONGO_URI=mongodb+srv://connectlyuser:PASSWORD@cluster0.xxxxx.mongodb.net/Connectly?retryWrites=true&w=majority
```

## Step 8: Restart Backend

1. If backend is running, stop it (Ctrl+C)
2. Run: `npm run dev`
3. You should see: `Connected to DB: cluster0.xxxxx.mongodb.net`

## Done! ✅

Your Connectly app is now connected to MongoDB Atlas!

---

## Testing Your Setup

1. Open http://localhost:5173 in browser
2. Click "Sign Up Instead"
3. Create an account:
   - Name: Test User
   - Username: testuser
   - Password: test123
   - Bio: Testing
   - Avatar: Upload any image
4. Click "Sign Up"

If successful, you'll be logged in and can start using Connectly!

## Common Issues

**"No suitable servers found"**
- Check your connection string is correct
- Verify password matches what you set
- Make sure IP whitelist includes your IP (or "Allow from Anywhere")

**"Authentication failed"**
- Double-check username and password in connection string
- Make sure database user was created successfully

**"Connection timeout"**
- Wait a few minutes after creating cluster (it might still be deploying)
- Check your internet connection

## Security Note

⚠️ The `.env` file is in `.gitignore` so it won't be committed to GitHub (good!).

In production (Vercel/Railway), you'll add these env vars in the dashboard, not in .env files.
