import api from "../api/axios";

export const progressService = {
  getMyProgress: async (bootcampId: string) => {
    const response = await api.get(`/progress/${bootcampId}/me`);
    return response.data;
  },
};
