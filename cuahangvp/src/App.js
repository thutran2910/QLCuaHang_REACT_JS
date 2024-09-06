import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import Footer from './components/Footer/Footer';
import Register from './components/User/Register';
import Login from './components/User/Login';

const App = () => {
  const [category, setCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategorySelect = (category) => {
    setCategory(category);
    setSearchTerm(''); // Xóa từ khóa tìm kiếm khi chọn danh mục
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCategory(null); // Xóa danh mục khi tìm kiếm
  };

  return (
    <Router>
      <Header onCategorySelect={handleCategorySelect} onSearch={handleSearch} />
      <Routes>
        <Route path="/" element={<Home category={category} searchTerm={searchTerm} />} />
        <Route path="/home" element={<Home category={category} searchTerm={searchTerm} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
