# 🔧 SmartHire Deployment Troubleshooting Guide

## Common Issues and Solutions

---

## 🚫 Backend Deployment Issues

### Issue 1: "Build Failed" on Render

**Symptoms:**
- Render shows "Build failed" status
- Logs show npm install errors

**Solutions:**
1. Check `package.json` exists in `server/` directory
2. Verify Node.js version compatibility
3. Check for missing dependencies
4. Try clearing build cache on Render

**Steps:**
```bash
# Locally test the build
cd server
npm install
node index.js
```

---

### Issue 2: "Application Failed to Start"

**Symptoms:**
- Build succeeds but service won't start
- Logs show "Error: Cannot find module"

**Solutions:**
1. Verify start command is `node index.js`
2. Check all dependencies are in `package.json`
3. Ensure `index.js` exists in server directory

**Check Render Settings:**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `node index.js`

---

### Issue 3: "Database Connection Failed"

**Symptoms:**
- Backend starts but crashes immediately
- Logs show "Unable to connect to database"

**Solutions:**
1. Verify database environment variables:
   ```
   DB_HOST=correct-host.render.com
   DB_PORT=5432
   DB_NAME=smarthire_db
   DB_USER=correct_user
   DB_PASSWORD=correct_password
   ```

2. Check database is running on Render
3. Ensure backend and database are in same region
4. Verify database allows connections from backend

**Test Database Connection:**
```sql
-- In Render PostgreSQL console
SELECT version();
```

---

### Issue 4: "Port Already in Use"

**Symptoms:**
- Error: "EADDRINUSE: address already in use"

**Solutions:**
1. Ensure PORT environment variable is set to 5000
2. Don't hardcode port in index.js
3. Let Render assign the port automatically

**Correct Code:**
```javascript
const PORT = process.env.PORT || 5000;
```

---

## 🌐 Frontend Deployment Issues

### Issue 5: "Build Failed" - Frontend

**Symptoms:**
- Static site build fails
- Logs show compilation errors

**Solutions:**
1. Check for TypeScript/JavaScript errors
2. Verify all imports are correct
3. Check for missing dependencies
4. Ensure `package.json` is in `client/` directory

**Test Locally:**
```bash
cd client
npm install
npm run build
```

---

### Issue 6: "Blank Page After Deployment"

**Symptoms:**
- Frontend deploys successfully
- Page loads but shows blank screen
- Console shows errors

**Solutions:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check for CORS errors
4. Ensure build directory is set to `build`

**Verify Environment Variables:**
```
REACT_APP_API_URL=https://your-backend.onrender.com/api
REACT_APP_SERVER_URL=https://your-backend.onrender.com
```

---

### Issue 7: "404 on Page Refresh"

**Symptoms:**
- Routes work when navigating within app
- Direct URL access or refresh shows 404

**Solutions:**
1. Add `_redirects` file in `client/public/`:
   ```
   /*    /index.html   200
   ```

2. Verify file is included in build
3. Check Render static site settings

---

## 🔗 Connection Issues

### Issue 8: "CORS Error"

**Symptoms:**
- Frontend can't connect to backend
- Console shows: "Access-Control-Allow-Origin"

**Solutions:**
1. Update `CLIENT_URL` in backend environment variables
2. Verify CORS configuration in `server/index.js`
3. Ensure no trailing slashes in URLs
4. Check both HTTP and HTTPS protocols match

**Backend CORS Config:**
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

**Environment Variables:**
```
# Backend
CLIENT_URL=https://smarthire-frontend.onrender.com

# Frontend
REACT_APP_API_URL=https://smarthire-backend.onrender.com/api
```

---

### Issue 9: "API Calls Failing"

**Symptoms:**
- Network errors in console
- API requests timeout or fail

**Solutions:**
1. Verify backend is running (check Render dashboard)
2. Test backend URL directly in browser
3. Check backend logs for errors
4. Verify API URL in frontend is correct

**Test Backend:**
```
Visit: https://your-backend.onrender.com/
Should return: {"message": "SmartHire Backend..."}
```

---

### Issue 10: "WebSocket Connection Failed"

**Symptoms:**
- Real-time features not working
- Console shows WebSocket errors

**Solutions:**
1. Verify Socket.io configuration
2. Check CORS settings include WebSocket
3. Ensure backend supports WebSocket connections
4. Check firewall/proxy settings

---

## 🔐 Authentication Issues

### Issue 11: "Login Not Working"

**Symptoms:**
- Login form submits but fails
- "Invalid credentials" error

**Solutions:**
1. Verify admin account exists in database
2. Check JWT_SECRET is set in backend
3. Verify password hashing is working
4. Check database connection

**Create Admin Account:**
```sql
-- Run in PostgreSQL console
INSERT INTO "Admins" (username, email, password, name, "createdAt", "updatedAt") 
VALUES ('admin', 'admin@rajalakshmi.edu.in', 
'$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7dO', 
'Admin', NOW(), NOW());
```

---

### Issue 12: "Token Expired" Errors

**Symptoms:**
- Users logged out frequently
- "Token expired" messages

**Solutions:**
1. Check JWT_EXPIRE setting (default: 7d)
2. Verify JWT_SECRET hasn't changed
3. Clear browser localStorage
4. Check server time is correct

---

## 📧 Email Issues

### Issue 13: "Emails Not Sending"

**Symptoms:**
- Registration works but no email received
- Backend logs show email errors

**Solutions:**
1. Verify Gmail app password is correct
2. Check 2FA is enabled on Gmail
3. Verify EMAIL_USER and EMAIL_PASS are set
4. Check Gmail hasn't blocked the app

**Test Email Settings:**
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx (app password)
```

**Generate New App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Create new app password
3. Update EMAIL_PASS in Render

---

## 🗄️ Database Issues

### Issue 14: "Table Does Not Exist"

**Symptoms:**
- Errors about missing tables
- "relation does not exist"

**Solutions:**
1. Check database migrations ran successfully
2. Verify Sequelize sync is enabled
3. Manually create tables if needed
4. Check database logs on Render

**Force Sync (Development Only):**
```javascript
await sequelize.sync({ force: true }); // WARNING: Deletes data!
```

---

### Issue 15: "Database Connection Timeout"

**Symptoms:**
- Slow database queries
- Connection timeout errors

**Solutions:**
1. Check database is in same region as backend
2. Verify database isn't overloaded
3. Optimize queries
4. Consider upgrading database plan

---

## 🐌 Performance Issues

### Issue 16: "Slow First Load"

**Symptoms:**
- First request takes 30-60 seconds
- Subsequent requests are fast

**Cause:**
- Render free tier spins down after 15 minutes inactivity

**Solutions:**
1. Upgrade to paid plan ($7/month)
2. Use external uptime monitor to ping every 10 minutes
3. Warn users about initial delay

**Uptime Monitors (Free):**
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com

---

### Issue 17: "High Memory Usage"

**Symptoms:**
- Backend crashes randomly
- "Out of memory" errors

**Solutions:**
1. Optimize database queries
2. Reduce concurrent connections
3. Clear unused data
4. Upgrade to larger instance

---

## 🔍 Debugging Tips

### Check Backend Logs
1. Go to Render dashboard
2. Select your backend service
3. Click "Logs" tab
4. Look for errors in red

### Check Frontend Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Network tab for failed requests

### Test API Endpoints
```bash
# Test backend health
curl https://your-backend.onrender.com/

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-backend.onrender.com/api/students/profile
```

### Check Database
1. Go to Render PostgreSQL dashboard
2. Click "Connect" → "External Connection"
3. Use psql or any PostgreSQL client
4. Run queries to check data

---

## 📞 Getting Help

### Render Support
- Dashboard: https://dashboard.render.com
- Docs: https://render.com/docs
- Community: https://community.render.com

### Check Status
- Render Status: https://status.render.com
- GitHub Status: https://www.githubstatus.com

### Debug Checklist
- [ ] Check Render service status
- [ ] Review deployment logs
- [ ] Verify environment variables
- [ ] Test database connection
- [ ] Check CORS configuration
- [ ] Verify API endpoints
- [ ] Test authentication
- [ ] Check browser console
- [ ] Review network requests
- [ ] Test on different browsers

---

## 🆘 Emergency Procedures

### If Everything Breaks:

1. **Check Render Status**
   - Visit https://status.render.com
   - Check for ongoing incidents

2. **Rollback Deployment**
   - Go to Render dashboard
   - Click "Manual Deploy"
   - Select previous working commit

3. **Restore Database**
   - Use Render's backup feature
   - Restore to last known good state

4. **Clear Cache**
   - Clear browser cache
   - Clear Render build cache
   - Restart services

5. **Contact Support**
   - Open ticket on Render
   - Provide logs and error messages
   - Include steps to reproduce

---

## ✅ Prevention Checklist

- [ ] Test locally before deploying
- [ ] Use version control (Git)
- [ ] Keep backups of database
- [ ] Monitor error logs regularly
- [ ] Set up uptime monitoring
- [ ] Document all changes
- [ ] Test in staging environment
- [ ] Have rollback plan ready

---

**💡 Pro Tip:** Most issues are caused by incorrect environment variables or CORS configuration. Always check these first!

**🎯 Remember:** Render free tier has limitations. For production use, consider upgrading to paid plans for better reliability and performance.
