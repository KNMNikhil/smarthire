# SmartHire - Complete Placement Portal

A comprehensive placement management system for colleges built with React.js, Node.js, Express.js, and PostgreSQL.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview of students, companies, and placement statistics
- **Student Management**: Add, edit, delete student records
- **Company Management**: Add new companies with eligibility criteria
- **Real-time Updates**: Live registration status updates
- **Statistics & Analytics**: Charts and graphs for placement data
- **Query Management**: Handle student queries and replies
- **Broadcast Messaging**: Send announcements to all students
- **History Tracking**: View past placement drives and outcomes

### Student Features
- **Dashboard**: Personal placement status and eligible opportunities
- **Inbox**: View eligible companies and registration links
- **Calendar**: Upcoming placement drives and events
- **Real-time Chat**: Receive announcements from admin
- **Query System**: Send queries to admin and track responses
- **Alumni Network**: Connect with alumni profiles
- **Automated Reminders**: Email notifications for upcoming drives

### Technical Features
- **JWT Authentication**: Secure login for both admin and student
- **Role-based Access Control**: Different permissions for admin/student
- **Real-time Communication**: Socket.io for live updates
- **Email Notifications**: Automated reminders using Nodemailer
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Database Integration**: PostgreSQL with Sequelize ORM

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Real-time**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer
- **Scheduling**: Node-Cron

## 📁 Project Structure

```
SMARTHIRE-PROJECT/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── admin/      # Admin dashboard components
│   │   │   ├── student/    # Student dashboard components
│   │   │   ├── layouts/    # Layout components
│   │   │   └── common/     # Shared components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Authentication & validation
│   └── utils/             # Email, Socket.io, Cron jobs
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SMARTHIRE-PROJECT
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Database Setup**
   - Create a PostgreSQL database named `smarthire_db`
   - Update database credentials in `server/.env`

4. **Environment Configuration**
   
   **Server (.env)**:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=smarthire_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   # Email (Gmail SMTP)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   CLIENT_URL=http://localhost:3000
   ```

   **Client (.env)**:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SERVER_URL=http://localhost:5000
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend (port 3000).

## 📊 Database Schema

### Key Tables
- **Students**: Student information and academic records
- **Admins**: Admin user accounts
- **Companies**: Company details and eligibility criteria
- **Registrations**: Student-company registration mapping
- **Queries**: Student queries and admin replies
- **Alumni**: Alumni profiles for networking
- **Messages**: Chat messages and announcements
- **History**: Past placement drive records

## 🔐 Authentication

### Default Admin Account
Create an admin account by directly inserting into the database:

```sql
INSERT INTO "Admins" (username, email, password, name, "createdAt", "updatedAt") 
VALUES ('admin', 'admin@college.edu', '$2a$12$hashedpassword', 'System Admin', NOW(), NOW());
```

### Student Registration
Students are added by admin through the admin panel.

## 📧 Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password in EMAIL_PASS

## 🔄 Real-time Features

- **Live Registration Updates**: Admin sees real-time student registrations
- **Instant Messaging**: Broadcast messages appear immediately
- **Status Updates**: Placement status changes reflect instantly

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Deploy to platforms like Heroku, AWS, or DigitalOcean
3. Ensure PostgreSQL database is accessible

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Update API URLs for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## 🔮 Future Enhancements

- Mobile app development
- Advanced analytics dashboard
- Integration with external job portals
- AI-powered student-company matching
- Video interview scheduling
- Document management system

---

**SmartHire** - Streamlining college placements with modern technology! 🎓✨