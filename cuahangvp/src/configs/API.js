import axios from 'axios';

const BASE_URL = 'http://192.168.1.220:8000'; // Đảm bảo URL đúng

export const endpoints = {
  'category': '/category/'
}

export default axios.create({
  baseURL: BASE_URL
});