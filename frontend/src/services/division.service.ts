import api from "./api";

export type DivisionDto = {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
};
export type DivisionListDto = {
  success: boolean;
  message: string;
  data: DivisionDto[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const getDivisions = async (params?: { name?: string }) => {
  const res = await api.get("/divisions", { params });
  return res.data;
};
export const createDivision = async (data: {
  name: string;
  description?: string;
}) => {
  const res = await api.post("/divisions", data);
  return res.data;
};
export const updateDivision = async (
  id: string,
  data: { name?: string; description?: string },
) => {
  const res = await api.put(`/divisions/${id}`, data);
  return res.data;
};
export const deleteDivision = async (id: string) => {
  const response = await api.delete(`/divisions/${id}`);
  return response.data;
};
