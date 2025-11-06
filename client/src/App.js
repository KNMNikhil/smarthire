import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Auth Components
import StudentLogin from './components/auth/StudentLogin';
import StudentRegister from './components/auth/StudentRegister';
import AdminLogin from './components/auth/AdminLogin';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';

// Lazy Components
import {
  LazyStudentDashboard, LazyStudentInbox, LazyStudentCalendar,
  LazyStudentQueries, LazyStudentChats, LazyStudentAlumni, LazyStudentProfile,
  LazyAdminDashboard, LazyAdminStudents, LazyAdminUploads,
  LazyAdminUpdates, LazyAdminStatistics, LazyAdminQueries,
  LazyAdminChats, LazyAdminHistory, LazyAdminProfile
} from './utils/lazyLoad';

// Layout Components
import StudentLayout from './components/layouts/StudentLayout';
import AdminLayout from './components/layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import TopLoader from './components/ui/TopLoader';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <TopLoader />
          <div className="min-h-screen bg-gray-50">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/student/login" />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Student Protected Routes */}
            <Route path="/student" element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Suspense><LazyStudentDashboard /></Suspense>} />
              <Route path="inbox" element={<Suspense><LazyStudentInbox /></Suspense>} />
              <Route path="calendar" element={<Suspense><LazyStudentCalendar /></Suspense>} />
              <Route path="queries" element={<Suspense><LazyStudentQueries /></Suspense>} />
              <Route path="chats" element={<Suspense><LazyStudentChats /></Suspense>} />
              <Route path="alumni" element={<Suspense><LazyStudentAlumni /></Suspense>} />
              <Route path="profile" element={<Suspense><LazyStudentProfile /></Suspense>} />
            </Route>

            {/* Admin Protected Routes */}
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Suspense><LazyAdminDashboard /></Suspense>} />
              <Route path="students" element={<Suspense><LazyAdminStudents /></Suspense>} />
              <Route path="uploads" element={<Suspense><LazyAdminUploads /></Suspense>} />
              <Route path="updates" element={<Suspense><LazyAdminUpdates /></Suspense>} />
              <Route path="statistics" element={<Suspense><LazyAdminStatistics /></Suspense>} />
              <Route path="queries" element={<Suspense><LazyAdminQueries /></Suspense>} />
              <Route path="chats" element={<Suspense><LazyAdminChats /></Suspense>} />
              <Route path="history" element={<Suspense><LazyAdminHistory /></Suspense>} />
              <Route path="profile" element={<Suspense><LazyAdminProfile /></Suspense>} />
            </Route>
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;