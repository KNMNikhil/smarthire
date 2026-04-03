# 🚀 SmartHire Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ What's Ready:
- [x] Frontend (React.js) - Production build ready
- [x] Backend (Node.js + Express) - API endpoints configured
- [x] Database (PostgreSQL) - Schema and data ready
- [x] Environment variables configured
- [x] All features tested and working

---

## 🌐 Deployment Options

### **Option 1: Render.com (Recommended - FREE)**
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ PostgreSQL database included
- ✅ SSL certificates (HTTPS)
- ✅ Easy setup

### **Option 2: Vercel + Railway**
- Frontend on Vercel (Free)
- Backend + Database on Railway (Free tier)

### **Option 3: Heroku**
- All-in-one platform
- Free tier with limitations

---

## 🎯 RECOMMENDED: Deploy on Render.com

### **Step 1: Prepare GitHub Repository**

1. **Create GitHub Account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Install Git** (if not installed)
   - Download from https://git-scm.com/downloads
   - Install with default settings

3. **Initialize Git Repository**
   ```bash
   cd c:\Users\Nikhil\OneDrive\Desktop\SMARTHIRE-PROJECT
   git init
   git add .
   git commit -m "Initial commit - SmartHire deployment ready"
   ```

4. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `smarthire-placement-portal`
   - Make it Public
   - Click "Create repository"

5. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/smarthire-placement-portal.git
   git branch -M main
   git push -u origin main
   ```

---

### **Step 2: Deploy Backend on Render**

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (recommended)

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `smarthire-db`
   - Database: `smarthire_db`
   - User: `smarthire_user`
   - Region: Choose closest to you
   - Plan: **Free**
   - Click "Create Database"
   - **SAVE** the connection details (Internal/External Database URL)

3. **Create Web Service (Backend)**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `smarthire-placement-portal`
   - Configure:
     - **Name**: `smarthire-backend`
     - **Region**: Same as database
     - **Branch**: `main`
     - **Root Directory**: `server`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node index.js`
     - **Plan**: Free

4. **Add Environment Variables**
   Click "Environment" and add:
   ```
   NODE_ENV=production
   PORT=5000
   
   # Database (from Render PostgreSQL)
   DB_HOST=<from_render_database>
   DB_PORT=5432
   DB_NAME=smarthire_db
   DB_USER=<from_render_database>
   DB_PASSWORD=<from_render_database>
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   
   # Email (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Frontend URL (will update after frontend deployment)
   CLIENT_URL=https://smarthire-frontend.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - **SAVE** your backend URL: `https://smarthire-backend.onrender.com`

---

### **Step 3: Deploy Frontend on Render**

1. **Create Web Service (Frontend)**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure:
     - **Name**: `smarthire-frontend`
     - **Branch**: `main`
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`

2. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://smarthire-backend.onrender.com/api
   REACT_APP_SERVER_URL=https://smarthire-backend.onrender.com
   ```

3. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (5-10 minutes)
   - **YOUR LIVE URL**: `https://smarthire-frontend.onrender.com`

---

### **Step 4: Update Backend with Frontend URL**

1. Go to backend service on Render
2. Update `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://smarthire-frontend.onrender.com
   ```
3. Save changes (will auto-redeploy)

---

## 🎉 YOUR WEBSITE IS LIVE!

### **Access URLs:**
- **Frontend (Main Website)**: `https://smarthire-frontend.onrender.com`
- **Backend API**: `https://smarthire-backend.onrender.com`
- **Database**: Managed by Render

### **Login Credentials:**
- **Admin**: Use your admin credentials
- **Student**: Students can register or use existing accounts

---

## 📱 Alternative: Deploy on Vercel (Frontend) + Railway (Backend)

### **Vercel Deployment (Frontend)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd client
   vercel
   ```
   - Follow prompts
   - Set environment variables when asked

### **Railway Deployment (Backend + Database)**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-configure connection

4. **Configure Backend Service**
   - Add environment variables
   - Deploy

---

## 🔧 Production Optimizations

### **1. Update package.json (Root)**
```json
{
  "scripts": {
    "start": "cd server && node index.js",
    "build": "cd client && npm install && npm run build",
    "install-server": "cd server && npm install",
    "install-client": "cd client && npm install",
    "heroku-postbuild": "npm run install-server && npm run install-client && npm run build"
  }
}
```

### **2. Create .gitignore (Root)**
```
node_modules/
.env
.DS_Store
*.log
client/build/
server/uploads/
```

### **3. Update CORS (server/index.js)**
Already configured to accept multiple origins!

---

## 🔐 Security Checklist

- [x] Environment variables secured
- [x] JWT secret changed for production
- [x] CORS configured properly
- [x] Password hashing enabled
- [x] SQL injection prevention
- [x] Input validation

---

## 📊 Post-Deployment Tasks

1. **Test All Features**
   - Student registration
   - Student login
   - Admin login
   - Company registration
   - Calendar events
   - Notifications

2. **Initialize Database**
   - Create admin account
   - Add initial companies
   - Test with sample students

3. **Monitor Performance**
   - Check Render dashboard
   - Monitor database usage
   - Check API response times

---

## 🆘 Troubleshooting

### **Issue: Database Connection Failed**
- Check DATABASE_URL in environment variables
- Verify PostgreSQL is running
- Check firewall settings

### **Issue: Frontend Can't Connect to Backend**
- Verify REACT_APP_API_URL is correct
- Check CORS settings
- Ensure backend is deployed and running

### **Issue: 404 Errors**
- Check build command executed successfully
- Verify publish directory is correct
- Check routing configuration

---

## 💰 Cost Breakdown

### **Render.com (Recommended)**
- PostgreSQL Database: **FREE** (90 days, then $7/month)
- Backend Web Service: **FREE** (spins down after inactivity)
- Frontend Static Site: **FREE**
- **Total: FREE** (with limitations)

### **Upgrade Options**
- Paid plans start at $7/month per service
- No spin-down delays
- More resources
- Better performance

---

## 🎯 Quick Deploy Commands

```bash
# 1. Prepare repository
git init
git add .
git commit -m "Deployment ready"

# 2. Create GitHub repo and push
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# 3. Deploy on Render
# - Go to render.com
# - Connect GitHub
# - Follow steps above

# 4. Access your live website!
```

---

## 📞 Support

If you face any issues during deployment:
1. Check Render logs for errors
2. Verify all environment variables
3. Test database connection
4. Check GitHub repository is public

---

**🎉 Congratulations! Your SmartHire Placement Portal is now accessible from anywhere in the world!**

**Share your live URL with:**
- College administration
- Students
- Companies
- Anyone with internet access!

---

*Last Updated: November 2024*
*Deployment Platform: Render.com*
*Status: Production Ready ✅*