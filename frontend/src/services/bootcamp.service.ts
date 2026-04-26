import api from '../api/axios';

export const bootcampService = {
  getByDivision: (divisionId: string) =>
    api.get(`/divisions/${divisionId}/bootcamps`),

  create: (divisionId: string, data: any) =>
    api.post(`/divisions/${divisionId}/bootcamps`, data),

  update: (id: string, data: any) =>
    api.put(`/bootcamps/${id}`, data),

  delete: (id: string) =>
    api.delete(`/bootcamps/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch(`/bootcamps/${id}/status`, { status }),
};