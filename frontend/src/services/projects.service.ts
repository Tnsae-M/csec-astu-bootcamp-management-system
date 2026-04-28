import api from '../api/axios';

export const projectsService = {
  getProjectsByBootcamp: async (bootcampId: string) => {
    const response = await api.get(`/projects/bootcamp/${bootcampId}`);
    return response.data;
  },

  createProject: async (bootcampId: string, data: any) => {
    const body = { ...data, bootcampId };
    const response = await api.post('/projects', body);
    return response.data;
  },
};
