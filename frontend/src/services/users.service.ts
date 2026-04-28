import api from '../api/axios';

export const usersService = {
  getUsers: async (role?: string) => {
    let url = '/users';
    if (role) url += `?role=${role}`;
    const response = await api.get(url);
    return response.data; // Expected { success: true, count: number, data: [users] }
  },

  getUser: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: { name: string; email: string; password?: string; role?: string; status?: string }) => {
    const response = await api.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }
};
