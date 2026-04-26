import api from '../api/axios';

export const submissionsService = {
  submitTask: async (data: any) => {
    const response = await api.post('/submissions', data);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await api.get('/submissions/me');
    return response.data;
  },

  getSubmissionsByTask: async (taskId: string) => {
    const response = await api.get(`/submissions/task/${taskId}`);
    return response.data;
  },

  gradeSubmission: async (id: string, data: any) => {
    const response = await api.put(`/submissions/${id}/grade`, data);
    return response.data;
  },
};
