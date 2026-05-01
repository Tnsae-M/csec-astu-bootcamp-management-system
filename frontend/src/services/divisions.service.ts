import api from '../api/axios';
import { ApiResponse, Division, Bootcamp } from '../types';

export const divisionService = {
  getDivisions: async () => {
    const res = await api.get<ApiResponse<Division[]>>('/divisions');
    return res.data;
  },
  getDivision: async (id: string) => {
    const res = await api.get<ApiResponse<Division>>(`/divisions/${id}`);
    return res.data;
  },
  createDivision: async (data: any) => {
    const res = await api.post<ApiResponse<Division>>('/divisions', data);
    return res.data;
  },
  updateDivision: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<Division>>(`/divisions/${id}`, data);
    return res.data;
  },
  deleteDivision: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/divisions/${id}`);
    return res.data;
  },
  getDivisionBootcamps: async (divisionId: string) => {
    const res = await api.get<ApiResponse<Bootcamp[]>>(`/divisions/${divisionId}/bootcamps`);
    return res.data;
  },
  createDivisionBootcamp: async (divisionId: string, data: any) => {
    const res = await api.post<ApiResponse<Bootcamp>>(`/divisions/${divisionId}/bootcamps`, data);
    return res.data;
  }
};

export const bootcampService = {
  getBootcamps: async () => {
    const res = await api.get<ApiResponse<Bootcamp[]>>('/bootcamps');
    return res.data;
  },
  getBootcamp: async (id: string) => {
    const res = await api.get<ApiResponse<Bootcamp>>(`/bootcamps/${id}`);
    return res.data;
  },
  updateBootcamp: async (id: string, data: any) => {
    const res = await api.put<ApiResponse<Bootcamp>>(`/bootcamps/${id}`, data);
    return res.data;
  },
  deleteBootcamp: async (id: string) => {
    const res = await api.delete<ApiResponse<null>>(`/bootcamps/${id}`);
    return res.data;
  }
};
