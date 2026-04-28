import api from '../api/axios';

export const divisionsService = {
  getDivisions: async (name?: string) => {
    let url = '/divisions';
    if (name) url += `?name=${name}`;
    const response = await api.get(url);
    return response.data;
  },

  getDivision: async (id: string) => {
    const response = await api.get(`/divisions/${id}`);
    return response.data;
  },

  createDivision: async (data: { name: string; description?: string }) => {
    const response = await api.post('/divisions', data);
    return response.data;
  },

  updateDivision: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.put(`/divisions/${id}`, data);
    return response.data;
  },

  deleteDivision: async (id: string) => {
    const response = await api.delete(`/divisions/${id}`);
    return response.data;
  }
};
