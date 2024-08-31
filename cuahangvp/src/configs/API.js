import axios from 'axios';

const BASE_URL = 'http://192.168.0.102:8000/';

export const endpoints = {
  category: '/category/',
  discountedProducts: '/discounted-products/',
  productsByCategory: (categoryId) => `/category/${categoryId}/products/`,
  searchProducts: (searchTerm) => `/product/?q=${searchTerm}`, // Đường dẫn cho tìm kiếm sản phẩm
};

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export default apiClient;
