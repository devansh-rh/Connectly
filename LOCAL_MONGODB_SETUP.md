# Local MongoDB Setup for Connectly

Set up MongoDB locally on your Windows machine for development.

## Step 1: Download MongoDB Community

1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (e.g., 7.0 or latest)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **"Download"**

## Step 2: Install MongoDB

1. Double-click the downloaded `.msi` file
2. Click **"Next"** to start the installer
3. Accept the License Agreement → **"Next"**
4. Choose **"Complete"** installation → **"Next"**
5. **"Install MongoDB as a Service"** - Make sure this is checked
6. Click **"Install"** (requires admin privileges)
7. Wait for installation to complete
8. Click **"Finish"**

## Step 3: Start MongoDB Service

### Option A: Start Service (Automatic)

MongoDB should start automatically after installation. To verify:

**Check if MongoDB is running:**
```powershell
Get-Service MongoDB
```

If it shows `Status : Running`, MongoDB is active! ✅

### Option B: Manual Start (If needed)

```powershell
# Start MongoDB service
Start-Service MongoDB

# Stop MongoDB service
Stop-Service MongoDB
```

## Step 4: Verify MongoDB Installation

Open a new PowerShell and run:

```powershell
mongosh
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/?directConnection=true
```

And you'll get a prompt like:
```
test>
```

If you see this - **MongoDB is working!** ✅

Type `exit` to quit.

## Step 5: Update Connectly .env

Your [server/.env](server/.env) should have:

```env
MONGO_URI=mongodb://localhost:27017/Connectly
```

This connects to your local MongoDB with database name "Connectly".

## Step 6: Start Connectly

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

You should see: ✅ `Connected to DB: 127.0.0.1:27017`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

You should see: ✅ `VITE ... ready`

## Step 7: Test the App

1. Open http://localhost:5173
2. Click "Sign Up Instead"
3. Create account with:
   - Name: Test User
   - Username: testuser
   - Password: test123
   - Bio: Testing Connectly
   - Avatar: Upload image
4. Click "Sign Up"

**If you see the home page - everything works!** 🎉

---

## MongoDB Commands

### Check MongoDB Service Status
```powershell
Get-Service MongoDB
```

### Start MongoDB
```powershell
Start-Service MongoDB
```

### Stop MongoDB
```powershell
Stop-Service MongoDB
```

### Connect to MongoDB CLI
```powershell
mongosh
```

### View All Databases (in mongosh)
```
show databases
```

### Switch to Connectly Database
```
use Connectly
```

### View Collections
```
show collections
```

### View All Users
```
db.users.find().pretty()
```

---

## Troubleshooting

### "Cannot start service MongoDB"
- MongoDB service might already be running
- Try: `Get-Service MongoDB | Restart-Service`

### "Connection refused on 27017"
- Check MongoDB service is running: `Get-Service MongoDB`
- If not running: `Start-Service MongoDB`
- Wait a few seconds for service to start

### "mongosh: command not found"
- Need to add MongoDB to PATH
- Or use full path: `C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe`
- Restart PowerShell after installation

### Port 27017 already in use
- Another MongoDB instance is running
- Or another service on that port
- Check: `netstat -ano | findstr :27017`

### Database not persisting
- Default MongoDB path: `C:\Program Files\MongoDB\Server\7.0\data`
- This should be created automatically
- Ensure adequate disk space

---

## File Locations

- **MongoDB Installation**: `C:\Program Files\MongoDB\Server\7.0\`
- **Data Directory**: `C:\Program Files\MongoDB\Server\7.0\data\`
- **Logs**: `C:\Program Files\MongoDB\Server\7.0\log\`
- **Config**: `C:\Program Files\MongoDB\Server\7.0\mongod.cfg`

---

## Development Tips

### View Data in Browser

Instead of using `mongosh`, you can install MongoDB Compass (GUI):
- Download: https://www.mongodb.com/products/tools/compass
- Connects to `mongodb://localhost:27017`
- Visual database browser
- Easy to manage data

### Backup Your Database

```powershell
mongodump --db Connectly --out C:\backups\connectly
```

### Restore from Backup

```powershell
mongorestore --db Connectly C:\backups\connectly\Connectly
```

---

## Performance Notes

- Local MongoDB uses default settings
- Suitable for development and testing
- For production: Use MongoDB Atlas or managed MongoDB service
- Local storage is faster than cloud for development

---

## Next Steps

1. ✅ Install MongoDB Community
2. ✅ Verify service is running
3. ✅ Update `.env` with local connection
4. ✅ Start Connectly servers
5. ✅ Test the app

Let me know if you need help with any step! 🚀
