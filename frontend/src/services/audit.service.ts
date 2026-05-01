import axios from '../api/axios';

const BASE = '/audit';

export const getActivities = async (limit = 20) => {
  const res = await axios.get(`${BASE}?limit=${limit}`);
  return res.data;
};

export default { getActivities };
