import api from "../api/axios";

export const feedbackService = {
  submitFeedback: async (data: any) => {
    const response = await api.post("/feedback", data);
    return response.data;
  },

  getBootcampFeedback: async (bootcampId: string) => {
    const response = await api.get(`/feedback/bootcamp/${bootcampId}`);
    return response.data;
  },

  getInstructorFeedback: async (instructorId: string) => {
    const response = await api.get(`/feedback/instructor/${instructorId}`);
    return response.data;
  },
};
