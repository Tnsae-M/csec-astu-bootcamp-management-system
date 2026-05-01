import api from '../api/axios';

export const tasksService = {
  getTasksByBootcamp: async (bootcampId: string) => {
    const response = await api.get(`/tasks/bootcamp/${bootcampId}`);
    return response.data;
  },

  getTaskById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: any) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id: string, data: any) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  }
};
