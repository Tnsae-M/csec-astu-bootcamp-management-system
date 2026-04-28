import api from '../api/axios';

export const groupsService = {
  getGroupsByBootcamp: async (bootcampId: string) => {
    const response = await api.get(`/groups/bootcamp/${bootcampId}`);
    return response.data; // Expected { success: true, count: number, data: [groups] }
  },

  createGroup: async (data: any) => {
    const response = await api.post('/groups', data);
    return response.data;
  },

  addMember: async (id: string, payload: any) => {
    const response = await api.put(`/groups/${id}/add`, payload);
    return response.data;
  },

  removeMember: async (id: string, userId: string) => {
    const response = await api.put(`/groups/${id}/remove/${userId}`);
    return response.data;
  },

  deleteGroup: async (id: string) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  }
};
