import axios from 'axios';
const baseURL = '/api'

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
}

const login = async (credentials) => {
  const response = await axios.post(`${baseURL}/login`, credentials);
  return response.data;
}

export default { setToken, login };
