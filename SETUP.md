# SmartHire Setup Guide

## Quick Setup Instructions

### 1. Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Git

### 2. Installation

```bash
# Clone and navigate to project
cd SMARTHIRE-PROJECT

# Install all dependencies
npm run install-all
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb smarthire_db

# Or using psql
psql -U postgres
CREATE DATABASE smarthire_db;
\q
```

### 4. Environment Configuration

**Server Environment (.env)**:
```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthire_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_secure
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

**Client Environment (.env)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SERVER_URL=http://localhost:5000
```

### 5. Initialize Database

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Initialize database with sample data
npm run init-db
```

### 6. Start Application

```bash
# From root directory
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend app on http://localhost:3000

## Default Login Credentials

### Admin Login
- **URL**: http://localhost:3000/admin/login
- **Username**: admin
- **Password**: admin123

### Student Login
- **URL**: http://localhost:3000/student/login
- **Email**: john.doe@student.edu
- **Password**: student123

## Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

## Project Structure

```
SMARTHIRE-PROJECT/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── package.json           # Root package.json
├── README.md             # Main documentation
└── SETUP.md              # This setup guide
```

## Features Available

### Admin Features
- ✅ Dashboard with statistics
- ✅ Student management (CRUD)
- ✅ Company management
- ✅ Real-time updates
- ✅ Query management
- ✅ Broadcasting system
- ✅ Analytics and reports

### Student Features
- ✅ Personal dashboard
- ✅ Company inbox
- ✅ Registration system
- ✅ Query system
- ✅ Alumni network
- ✅ Real-time notifications

### Technical Features
- ✅ JWT Authentication
- ✅ Role-based access
- ✅ Real-time Socket.io
- ✅ Email notifications
- ✅ Responsive design
- ✅ PostgreSQL database

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL service
# Windows: services.msc → PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

### Email Not Working
- Verify Gmail app password
- Check firewall settings
- Ensure 2FA is enabled on Gmail

## Development

### Adding New Features
1. Backend: Add routes in `/server/routes/`
2. Frontend: Add components in `/client/src/components/`
3. Database: Update models in `/server/models/`

### Testing
- Backend API: Use Postman or curl
- Frontend: Browser developer tools
- Database: pgAdmin or psql

## Production Deployment

### Backend (Heroku/AWS/DigitalOcean)
1. Set production environment variables
2. Use production PostgreSQL database
3. Update CORS settings

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Deploy build folder
3. Update API URLs

## Support

For issues:
1. Check console logs
2. Verify environment variables
3. Ensure database is running
4. Check network connectivity

---

**SmartHire** - Your Complete Placement Management Solution! 🎓