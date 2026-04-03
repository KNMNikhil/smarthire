# 🔐 Environment Variables Setup Guide

## Overview
This guide helps you configure all environment variables needed for SmartHire deployment.

---

## 📧 Gmail SMTP Setup (For Email Notifications)

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup process

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter name: "SmartHire"
5. Click "Generate"
6. **COPY** the 16-character password (no spaces)
7. Use this as `EMAIL_PASS` in environment variables

### Email Environment Variables:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx  (16-character app password)
```

---

## 🔑 JWT Secret Generation

### Option 1: Online Generator (Recommended)
1. Go to https://randomkeygen.com/
2. Copy any "CodeIgniter Encryption Keys" (256-bit)
3. Use as `JWT_SECRET`

### Option 2: Command Line
```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# Linux/Mac
openssl rand -base64 64
```

### JWT Environment Variables:
```
JWT_SECRET=your_generated_long_random_string_here
JWT_EXPIRE=7d
```

---

## 🗄️ Database Configuration (Render PostgreSQL)

### After Creating Database on Render:

1. Go to your database on Render dashboard
2. Click "Info" tab
3. Copy the connection details:

```
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=smarthire_db
DB_USER=smarthire_user
DB_PASSWORD=xxxxxxxxxxxxx
```

### Alternative: Single Connection String
Render also provides a single DATABASE_URL:
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

You can use either format. The individual variables are recommended for clarity.

---

## 🌐 CORS & Client URL Configuration

### Development:
```
CLIENT_URL=http://localhost:3000
```

### Production (After Frontend Deployment):
```
CLIENT_URL=https://smarthire-frontend.onrender.com
```

**⚠️ Important:** Update this AFTER deploying frontend!

---

## 📱 Frontend Environment Variables

Create in Render Static Site settings:

```
REACT_APP_API_URL=https://smarthire-backend.onrender.com/api
REACT_APP_SERVER_URL=https://smarthire-backend.onrender.com
```

**⚠️ Important:** Replace with your actual backend URL!

---

## 🔧 Complete Environment Variable Templates

### Backend (.env) - Development
```env
# Server
PORT=5000
NODE_ENV=development

# Database (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthire_db
DB_USER=postgres
DB_PASSWORD=your_local_password

# JWT
JWT_SECRET=your_development_secret_key
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client
CLIENT_URL=http://localhost:3000
```

### Backend - Production (Render)
```env
# Server
PORT=5000
NODE_ENV=production

# Database (Render PostgreSQL)
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=smarthire_db
DB_USER=smarthire_user
DB_PASSWORD=xxxxxxxxxxxxx

# JWT (GENERATE NEW FOR PRODUCTION!)
JWT_SECRET=LONG_RANDOM_STRING_256_CHARACTERS_MINIMUM
JWT_EXPIRE=7d

# Email (Gmail App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx

# Client (Update after frontend deployment)
CLIENT_URL=https://smarthire-frontend.onrender.com
```

### Frontend - Production (Render)
```env
REACT_APP_API_URL=https://smarthire-backend.onrender.com/api
REACT_APP_SERVER_URL=https://smarthire-backend.onrender.com
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Generate unique JWT_SECRET for production
- Use strong, random passwords
- Keep .env files in .gitignore
- Use environment variables, never hardcode
- Rotate secrets periodically
- Use different credentials for dev/prod

### ❌ DON'T:
- Commit .env files to Git
- Share credentials in plain text
- Use default/example passwords
- Reuse passwords across services
- Store credentials in code comments

---

## 📋 Environment Variables Checklist

### Backend (Render Web Service)
- [ ] NODE_ENV=production
- [ ] PORT=5000
- [ ] DB_HOST (from Render PostgreSQL)
- [ ] DB_PORT=5432
- [ ] DB_NAME=smarthire_db
- [ ] DB_USER (from Render PostgreSQL)
- [ ] DB_PASSWORD (from Render PostgreSQL)
- [ ] JWT_SECRET (generated, 64+ characters)
- [ ] JWT_EXPIRE=7d
- [ ] EMAIL_HOST=smtp.gmail.com
- [ ] EMAIL_PORT=587
- [ ] EMAIL_USER (your Gmail)
- [ ] EMAIL_PASS (Gmail app password)
- [ ] CLIENT_URL (frontend URL)

### Frontend (Render Static Site)
- [ ] REACT_APP_API_URL (backend URL + /api)
- [ ] REACT_APP_SERVER_URL (backend URL)

---

## 🧪 Testing Environment Variables

### Test Backend Connection:
```bash
# After deployment, visit:
https://your-backend-url.onrender.com/

# Should return:
{"message": "SmartHire Backend - PostgreSQL Integrated"}
```

### Test Database Connection:
Check Render logs for:
```
Database connection established successfully.
Database synchronized.
```

### Test Email Configuration:
Try student registration - should receive welcome email.

### Test Frontend-Backend Connection:
Open browser console on frontend, check for:
- No CORS errors
- Successful API calls
- WebSocket connection established

---

## 🆘 Troubleshooting

### "Database connection failed"
- Verify DB_HOST, DB_USER, DB_PASSWORD are correct
- Check database is running on Render
- Ensure database and backend are in same region

### "CORS error"
- Verify CLIENT_URL matches frontend URL exactly
- Check CORS configuration in server/index.js
- Ensure no trailing slashes in URLs

### "Email not sending"
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check Gmail app password is valid
- Ensure 2FA is enabled on Gmail account
- Check Render logs for email errors

### "JWT authentication failed"
- Verify JWT_SECRET is set and same across restarts
- Check token expiration (JWT_EXPIRE)
- Clear browser localStorage and login again

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Gmail SMTP**: https://support.google.com/mail/answer/7126229
- **JWT Best Practices**: https://jwt.io/introduction

---

## 🔄 Updating Environment Variables

### On Render:
1. Go to your service dashboard
2. Click "Environment" tab
3. Add/Edit variables
4. Click "Save Changes"
5. Service will automatically redeploy

**⚠️ Note:** Changing environment variables triggers a redeploy (takes 2-5 minutes)

---

**✅ Once all environment variables are configured, your SmartHire portal will be fully functional!**
