# 🚀 SmartHire - Quick Deployment Guide

## ✅ Your Project is Ready for Deployment!

### 📦 What's Already Configured:
- ✅ Production-ready CORS settings
- ✅ Environment variable support
- ✅ PostgreSQL database integration
- ✅ JWT authentication
- ✅ Socket.io for real-time updates
- ✅ Email notifications
- ✅ File upload handling

---

## 🎯 DEPLOY IN 3 STEPS

### **STEP 1: Push to GitHub** (5 minutes)

```bash
# Open Command Prompt in your project folder
cd c:\Users\Nikhil\OneDrive\Desktop\SMARTHIRE-PROJECT

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "SmartHire - Ready for deployment"

# Create GitHub repository at https://github.com/new
# Name it: smarthire-placement-portal
# Make it PUBLIC

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/smarthire-placement-portal.git
git branch -M main
git push -u origin main
```

---

### **STEP 2: Deploy Backend on Render** (10 minutes)

1. **Go to https://render.com** → Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `smarthire-db`
   - Region: Choose closest to you
   - Plan: **FREE**
   - Click "Create Database"
   - **COPY** the "Internal Database URL" (you'll need this!)

3. **Create Web Service (Backend)**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `smarthire-placement-portal`
   - Configure:
     - **Name**: `smarthire-backend`
     - **Region**: Same as database
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js`
     - **Plan**: Free

4. **Add Environment Variables** (Click "Environment" tab):
   ```
   NODE_ENV=production
   PORT=5000
   
   # Copy from your Render PostgreSQL Internal URL
   DB_HOST=<your-db-host>.oregon-postgres.render.com
   DB_PORT=5432
   DB_NAME=smarthire_db
   DB_USER=<your-db-user>
   DB_PASSWORD=<your-db-password>
   
   # Generate a strong secret (use: https://randomkeygen.com/)
   JWT_SECRET=<generate-a-long-random-string>
   JWT_EXPIRE=7d
   
   # Your Gmail credentials
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   
   # Will update after frontend deployment
   CLIENT_URL=https://smarthire-frontend.onrender.com
   ```

5. **Deploy** → Wait 5-10 minutes
   - Your backend URL: `https://smarthire-backend.onrender.com`

---

### **STEP 3: Deploy Frontend on Render** (10 minutes)

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure:
     - **Name**: `smarthire-frontend`
     - **Branch**: `main`
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`

2. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://smarthire-backend.onrender.com/api
   REACT_APP_SERVER_URL=https://smarthire-backend.onrender.com
   ```

3. **Deploy** → Wait 5-10 minutes
   - Your frontend URL: `https://smarthire-frontend.onrender.com`

4. **Update Backend CLIENT_URL**
   - Go back to backend service
   - Update environment variable:
     ```
     CLIENT_URL=https://smarthire-frontend.onrender.com
     ```
   - Save (will auto-redeploy)

---

## 🎉 DONE! Your Website is LIVE!

### **Access Your Website:**
- **Main Website**: https://smarthire-frontend.onrender.com
- **Backend API**: https://smarthire-backend.onrender.com

### **Create Admin Account:**

1. Go to your Render PostgreSQL database
2. Click "Connect" → "External Connection"
3. Use any PostgreSQL client or Render's web shell
4. Run this SQL:

```sql
INSERT INTO "Admins" (username, email, password, name, "createdAt", "updatedAt") 
VALUES (
  'admin', 
  'admin@rajalakshmi.edu.in', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7dO', 
  'System Admin', 
  NOW(), 
  NOW()
);
```

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change this password immediately after first login!**

---

## 📱 Share Your Website

Your SmartHire portal is now accessible from anywhere!

**Share these links:**
- Students: https://smarthire-frontend.onrender.com
- Admin Panel: https://smarthire-frontend.onrender.com/admin/login

---

## 🔧 Troubleshooting

### Backend not starting?
- Check Render logs for errors
- Verify all environment variables are set
- Ensure database is running

### Frontend can't connect to backend?
- Verify REACT_APP_API_URL is correct
- Check backend is deployed and running
- Verify CORS settings in backend

### Database connection failed?
- Check DB credentials in environment variables
- Ensure database is in same region as backend
- Verify firewall settings

---

## 💰 Free Tier Limitations

**Render Free Tier:**
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for 24/7 operation)
- Database: 90 days free, then $7/month

**To Upgrade:**
- Paid plans start at $7/month per service
- No spin-down delays
- Better performance
- More resources

---

## 📞 Need Help?

If deployment fails:
1. Check Render deployment logs
2. Verify all environment variables
3. Ensure GitHub repository is public
4. Check database connection string

---

**🎊 Congratulations! Your SmartHire Placement Portal is now LIVE and accessible worldwide!**

*Deployment Time: ~25 minutes*
*Cost: FREE (with limitations)*
*Status: Production Ready ✅*
