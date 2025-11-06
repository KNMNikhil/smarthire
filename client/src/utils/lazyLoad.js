import { lazy } from 'react';

export const LazyStudentDashboard = lazy(() => import('../components/student/StudentDashboard'));
export const LazyStudentInbox = lazy(() => import('../components/student/StudentInbox'));
export const LazyStudentCalendar = lazy(() => import('../components/student/StudentCalendar'));
export const LazyStudentQueries = lazy(() => import('../components/student/StudentQueries'));
export const LazyStudentChats = lazy(() => import('../components/student/StudentChats'));
export const LazyStudentAlumni = lazy(() => import('../components/student/StudentAlumni'));
export const LazyStudentProfile = lazy(() => import('../components/student/StudentProfile'));

export const LazyAdminDashboard = lazy(() => import('../components/admin/AdminDashboard'));
export const LazyAdminStudents = lazy(() => import('../components/admin/AdminStudents'));
export const LazyAdminUploads = lazy(() => import('../components/admin/AdminUploads'));
export const LazyAdminUpdates = lazy(() => import('../components/admin/AdminUpdates'));
export const LazyAdminStatistics = lazy(() => import('../components/admin/AdminStatistics'));
export const LazyAdminQueries = lazy(() => import('../components/admin/AdminQueries'));
export const LazyAdminChats = lazy(() => import('../components/admin/AdminChats'));
export const LazyAdminHistory = lazy(() => import('../components/admin/AdminHistory'));
export const LazyAdminProfile = lazy(() => import('../components/admin/AdminProfile'));