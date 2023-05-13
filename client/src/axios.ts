import axios from 'axios';

console.log('Public url', process.env.REACT_APP_API_BASE_URL);

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/',
});

export default instance;
