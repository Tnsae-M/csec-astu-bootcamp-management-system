// // import api from '../api/axios';

// // export const authService = {
// //   login: async (credentials: { email: string; password: string }) => {
// //     const response = await api.post('/auth/login', credentials);
// //     return response.data;
// //   },
  
// //   register: async (userData: any) => {
// //     const response = await api.post('/auth/register', userData);
// //     return response.data;
// //   },

// //   getCurrentUser: async () => {
// //     const response = await api.get('/auth/me');
// //     return response.data;
// //   }
// // };



// import api from '../api/axios';

// export const authService = {
//   // Login
//   login: async (credentials: { email: string; password: string }) => {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   },

//   // Register
//   register: async (userData: any) => {
//     const response = await api.post('/auth/register', userData);
//     return response.data;
//   },

//   // Get Current User (Protected)
//   getCurrentUser: async () => {
//     const response = await api.get('/auth/me');
//     return response.data;
//   },

//   // Refresh Token
//   refreshToken: async (refreshToken: string) => {
//     const response = await api.post('/auth/refresh', { refreshToken });
//     return response.data;
//   },

//   // Verify Email (via link from email)
//   verifyEmail: async (token: string) => {
//     const response = await api.get(`/auth/verify-email/${token}`);
//     return response.data;
//   },

//   // Forgot Password
//   forgotPassword: async (data: { email: string }) => {
//     const response = await api.post('/auth/forgot-password', data);
//     return response.data;
//   }

//   // Reset Password (via link from email)
// //   resetPassword: async ({ token, password }: { token: string; password: string }) => {
// //     const response = await api.post(`/auth/reset-password/${token}`, { password });
// //     return response.data;
// //   }
// // }

// // auth.service.ts
// resetPassword: async ({ token, password }: { token: string; password: string }) => {
//   // This matches your backend route /reset-password/:token
//   const response = await api.post(`/auth/reset-password/${token}`, { password });
//   return response.data;
// }}


import api from '../api/axios';

export const authService = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Verify Email
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (data: { email: string }) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset Password
  resetPassword: async ({ token, password }: { token: string; password: string }) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  }
};