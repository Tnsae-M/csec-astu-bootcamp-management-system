import axios from '../api/axios';

const BASE = '/reports';

export const getReports = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

export const createReport = async (payload: { title: string; content: string }) => {
  const res = await axios.post(BASE, payload);
  return res.data;
};

export const getReport = async (id: string) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

export const updateReport = async (id: string, payload: any) => {
  const res = await axios.put(`${BASE}/${id}`, payload);
  return res.data;
};

export const deleteReport = async (id: string) => {
  const res = await axios.delete(`${BASE}/${id}`);
  return res.data;
};

export default { getReports, createReport, getReport, updateReport, deleteReport };
