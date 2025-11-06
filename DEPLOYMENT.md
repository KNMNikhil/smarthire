# SmartHire Deployment Guide

## Frontend Deployment (Netlify)

### Prerequisites
1. Create accounts on:
   - Netlify (for frontend)
   - Heroku/Railway/Render (for backend)

### Backend Deployment First
1. Deploy your backend to Heroku/Railway/Render
2. Note down your backend URL (e.g., https://your-app.herokuapp.com)

### Frontend Deployment Steps

1. **Update Environment Variables**
   - Edit `client/.env.production`
   - Replace `https://your-backend-url.herokuapp.com` with your actual backend URL

2. **Build the Project**
   ```bash
   cd client
   npm install
   npm run build
   ```

3. **Deploy to Netlify**
   
   **Option A: Drag & Drop**
   - Go to https://netlify.com
   - Drag the `client/build` folder to Netlify dashboard
   
   **Option B: Git Integration**
   - Push code to GitHub
   - Connect GitHub repo to Netlify
   - Set build settings:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `client/build`

4. **Configure Environment Variables in Netlify**
   - Go to Site Settings > Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.herokuapp.com/api
     REACT_APP_SERVER_URL=https://your-backend-url.herokuapp.com
     GENERATE_SOURCEMAP=false
     ```

## Backend Deployment

### For Heroku:
1. Create Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Environment Variables for Backend:
```
NODE_ENV=production
PORT=5000
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=https://your-netlify-app.netlify.app
```

## Post-Deployment Checklist

✅ Frontend loads correctly
✅ Admin login works
✅ Student login works  
✅ All navigation works
✅ API calls reach backend
✅ Database operations work
✅ Real-time features work
✅ File uploads work
✅ Email notifications work

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Update CLIENT_URL in backend env
2. **API Not Found**: Check REACT_APP_API_URL in frontend env
3. **Database Connection**: Verify database credentials
4. **Build Failures**: Check Node.js version compatibility

### Testing Deployment:
1. Test admin login: admin@college.edu
2. Test student registration and login
3. Test all CRUD operations
4. Test real-time features
5. Test responsive design on mobile

## Files Created for Deployment:
- `client/public/_redirects` - Handles client-side routing
- `client/.env.production` - Production environment variables
- `netlify.toml` - Netlify build configuration
- `DEPLOYMENT.md` - This deployment guide

## Security Notes:
- Never commit real environment variables to Git
- Use strong JWT secrets in production
- Enable HTTPS for both frontend and backend
- Set up proper CORS policies