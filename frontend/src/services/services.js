import axios from 'axios';
const baseURL = '/api';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const login = async (credentials) => {
  const response = await axios.post(`${baseURL}/login`, credentials);
  return response.data;
};

const getConversations = async () => {
  const response = await axios.get(`${baseURL}/conversations`, {
    headers: { Authorization: token },
  });
  return response.data.conversations;
};

export default { setToken, login, getConversations };
