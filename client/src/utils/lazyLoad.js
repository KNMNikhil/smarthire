import { lazy } from 'react';

// Wrapper to handle ChunkLoadError and retry once
const retryLoad = (componentImport) => {
  return new Promise((resolve, reject) => {
    const key = 'retry-lazy-load-refreshed';
    const hasRetried = window.sessionStorage.getItem(key);
    
    componentImport()
      .then((component) => {
        window.sessionStorage.removeItem(key);
        resolve(component);
      })
      .catch((error) => {
        if (!hasRetried) {
          window.sessionStorage.setItem(key, 'true');
          return window.location.reload();
        }
        reject(error);
      });
  });
};

export const LazyStudentDashboard = lazy(() => retryLoad(() => import('../components/student/StudentDashboard')));
export const LazyStudentInbox = lazy(() => retryLoad(() => import('../components/student/StudentInbox')));
export const LazyStudentRegistrations = lazy(() => retryLoad(() => import('../components/student/StudentRegistrations')));
export const LazyStudentCalendar = lazy(() => retryLoad(() => import('../components/student/StudentCalendar')));
export const LazyStudentInternship = lazy(() => retryLoad(() => import('../components/student/StudentInternship')));
export const LazyStudentLearning = lazy(() => retryLoad(() => import('../components/student/StudentLearning')));
export const LazyStudentHigherStudies = lazy(() => retryLoad(() => import('../components/student/StudentHigherStudies')));
export const LazyStudentQueries = lazy(() => retryLoad(() => import('../components/student/StudentQueries')));
export const LazyStudentChats = lazy(() => retryLoad(() => import('../components/student/StudentChats')));
export const LazyStudentAlumni = lazy(() => retryLoad(() => import('../components/student/StudentAlumni')));
export const LazyStudentProfile = lazy(() => retryLoad(() => import('../components/student/StudentProfile')));
export const LazyResumeScanner = lazy(() => retryLoad(() => import('../components/student/ResumeScanner')));

export const LazyAdminDashboard = lazy(() => retryLoad(() => import('../components/admin/AdminDashboard')));
export const LazyAdminStudents = lazy(() => retryLoad(() => import('../components/admin/AdminStudents')));
export const LazyAdminUploads = lazy(() => retryLoad(() => import('../components/admin/AdminUploads')));
export const LazyAdminUpdates = lazy(() => retryLoad(() => import('../components/admin/AdminUpdates')));
export const LazyAdminStatistics = lazy(() => retryLoad(() => import('../components/admin/AdminStatistics')));
export const LazyAdminQueries = lazy(() => retryLoad(() => import('../components/admin/AdminQueries')));
export const LazyAdminChats = lazy(() => retryLoad(() => import('../components/admin/AdminChats')));
export const LazyAdminHistory = lazy(() => retryLoad(() => import('../components/admin/AdminHistory')));
export const LazyAdminProfile = lazy(() => retryLoad(() => import('../components/admin/AdminProfile')));