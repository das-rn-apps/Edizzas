import axios from "axios";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchCode = async (roomId: string) => {
  const res = await axios.get(`${BASE_URL}/api/code/${roomId}`);
  return res.data.code || "";
};

export const saveCode = async (roomId: string, code: string) => {
  const res = await axios.post(`${BASE_URL}/api/code`, { roomId, code });
  return res.data;
};
