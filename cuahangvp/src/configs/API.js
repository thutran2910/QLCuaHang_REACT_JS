import axios from 'axios';

const BASE_URL = 'http://192.168.0.102:8000/';

export const endpoints = {
  category: '/category/',
  discountedProducts: '/discounted-products/',
  productsByCategory: (categoryId) => `/category/${categoryId}/products/`,
  searchProducts: (searchTerm) => `/product/?q=${searchTerm}`, // Đường dẫn cho tìm kiếm sản phẩm
  cartItems: '/cartitem/',
  cartDetail: (cartId) => `/cart/${cartId}/`,  // Endpoint mới để lấy thông tin giỏ hàng
  user:'/user/',
  login: '/o/token/',
  currentUser: '/user/current-user/',
};

export const setAuthToken = (token) => {
  try {
    localStorage.setItem('access_token', token);  // Đảm bảo bạn đang lưu token đúng tên
    console.log('Token set successfully:', token);
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const getAuthToken = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found in localStorage');
    } else {
      console.log('Token retrieved successfully:', token);
    }
    return token; 
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('access_token');  // Đảm bảo tên token đúng
};

export const authApi = () => {
  try {
    const token = getAuthToken();
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error creating auth API instance:', error);
    throw error;
  }
};


const apiClient = axios.create({
  baseURL: BASE_URL,
});

export default apiClient;
