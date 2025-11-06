import api from './authService';

export const studentService = {
  getDashboard: async () => {
    const response = await fetch('/api/students/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return { data: await response.json() };
  },
  getInbox: () => api.get('/students/inbox'),
  registerForCompany: (companyId) => api.post(`/students/register/${companyId}`),
  getQueries: () => api.get('/students/queries'),
  createQuery: (queryData) => api.post('/students/queries', queryData),
  getAlumni: () => api.get('/students/alumni'),
  getMessages: () => api.get('/students/messages'),
  getProfile: () => api.get('/students/profile'),
  updateProfile: (profileData) => api.put('/students/profile', profileData)
};

export const adminService = {
  getDashboard: async () => {
    const response = await fetch('/api/admin/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return { data: await response.json() };
  },
  getStudents: async (params) => {
    const response = await fetch('/api/students', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return { data: await response.json() };
  },
  addStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getCompanies: () => api.get('/companies'),
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