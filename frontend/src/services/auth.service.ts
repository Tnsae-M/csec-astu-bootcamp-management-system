import api from '../api/axios';
import { ApiResponse, User } from '../types';

export const authService = {
  login: async (credentials: any) => {
    const res = await api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post<ApiResponse<User>>('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (token: string, password: string) => {
    const res = await api.post(`/auth/reset-password/${token}`, { password });
    return res.data;
  },
  verifyEmail: async (token: string) => {
    const res = await api.get(`/auth/verify-email/${token}`);
    return res.data;
  }
};

export const userService = {
  getUsers: async (role?: string, status?: string) => {
    const res = await api.get<ApiResponse<User[]>>(`/users`, { params: { role, status } });
    return res.data;
  },
  createUser: async (userData: any) => {
    const res = await api.post<ApiResponse<User>>('/users', userData);
    return res.data;
  },
  updateUser: async (id: string, userData: any) => {
    const res = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return res.data;
  }
};
