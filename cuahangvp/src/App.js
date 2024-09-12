import React, { useState, useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Footer from './components/Footer/Footer';
import Register from './components/User/Register';
import Login from './components/User/Login';
import Product from './components/Product/Product';
import News from './components/News/News';
import { MyUserContext, MyDispatchContext, MyUserReducer } from './configs/Contexts';
import { getAuthToken, authApi, endpoints } from './configs/API';

const App = () => {
  const [category, setCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, dispatch] = useReducer(MyUserReducer, null);

  const handleCategorySelect = (category) => {
    setCategory(category);
    setSearchTerm(''); // Xóa từ khóa tìm kiếm khi chọn danh mục
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCategory(null); // Xóa danh mục khi tìm kiếm
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authApi().get(endpoints.currentUser);
          dispatch({ type: 'login', payload: response.data });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <Router>
          <Header onCategorySelect={handleCategorySelect} onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<Home category={category} searchTerm={searchTerm} />} />
            <Route path="/home" element={<Home category={category} searchTerm={searchTerm} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/news" element={<News />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<Product /> } />/* Thêm route cho trang chi tiết sản phẩm */
          </Routes>
          <Footer />
        </Router>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;
