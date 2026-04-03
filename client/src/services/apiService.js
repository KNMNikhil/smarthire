import api from './authService';

export const studentService = {
  getDashboard: () => api.get('/students/dashboard'),
  getInbox: () => api.get('/students/inbox'),
  registerForCompany: (companyId) => api.post(`/students/register/${companyId}`),
  getRegisteredCompanies: () => api.get('/students/registered-companies'),
  getQueries: () => api.get('/students/queries'),
  createQuery: (queryData) => api.post('/students/queries', queryData),
  getAlumni: () => api.get('/students/alumni'),
  getMessages: () => api.get('/students/messages'),
  getProfile: () => api.get('/students/profile'),
  updateProfile: (profileData) => api.put('/students/profile', profileData),
  getCalendarEvents: () => api.get('/students/calendar/events'),
  createCalendarEvent: (eventData) => api.post('/students/calendar/events', eventData),
  updateCalendarEvent: (id, eventData) => api.put(`/students/calendar/events/${id}`, eventData),
  deleteCalendarEvent: (id) => api.delete(`/students/calendar/events/${id}`)
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  addStudent: (studentData) => api.post('/admin/students', studentData),
  updateStudent: (id, studentData) => api.put(`/admin/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getCompanies: () => api.get('/companies'),
  getCompanyRegistrations: (companyId) => api.get(`/students/company/${companyId}/registrations`),
  getQueries: () => api.get('/admin/queries'),
  replyToQuery: (id, reply) => api.put(`/admin/queries/${id}/reply`, { reply }),
  getStatistics: () => api.get('/admin/statistics'),
  sendBroadcast: (messageData) => api.post('/admin/broadcast', messageData)
};

export const companyService = {
  getCompanies: (params) => api.get('/companies', { params }),
  addCompany: (companyData) => api.post('/companies', companyData),
  updateCompany: (id, companyData) => api.put(`/companies/${id}`, companyData),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
  getCompanyRegistrations: (id, filter) => api.get(`/companies/${id}/registrations`, { params: { filter } }),
  completeCompanyDrive: (id, selectedStudents) => api.post(`/companies/${id}/complete`, { selectedStudents }),
  getHistory: () => api.get('/companies/history')
};

export const queryService = {
  getQueries: () => api.get('/queries'),
  createQuery: (queryData) => api.post('/queries', queryData),
  replyToQuery: (id, reply) => api.put(`/queries/${id}/reply`, { reply }),
  closeQuery: (id) => api.put(`/queries/${id}/close`)
};