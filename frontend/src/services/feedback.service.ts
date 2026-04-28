import api from '../api/axios';

export const feedbackService = {
  getFeedbacksBySession: async (sessionId: string) => {
    const response = await api.get(`/feedback/session/${sessionId}`);
    return response.data;
  },

  createFeedback: async (data: any) => {
    const response = await api.post('/feedback', data);
    return response.data;
  },
};
