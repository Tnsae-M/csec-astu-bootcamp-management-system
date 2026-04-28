import api from '../api/axios';

export const enrollmentsService = {
  getBootcampEnrollments: async (bootcampId: string) => {
    const response = await api.get(`/enrollments/bootcamp/${bootcampId}`);
    return response.data;
  },

  enrollUser: async (data: any) => {
    const response = await api.post('/enrollments', data);
    return response.data;
  },

  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/me');
    return response.data;
  },

  updateEnrollmentStatus: async (id: string, data: any) => {
    const response = await api.put(`/enrollments/${id}`, data);
    return response.data;
  },
};
