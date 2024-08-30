import axios from 'axios';

const BASE_URL = 'http://192.168.0.102:8000'; // Đảm bảo URL đúng

export const endpoints = {
  'category': '/category/',
  'discountedProducts': '/discounted-products/'
}

const apiClient = axios.create({
  baseURL: BASE_URL
});

export default apiClient;