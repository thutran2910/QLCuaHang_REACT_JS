import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Footer from './components/Footer/Footer';

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
        {/* Các route khác */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
