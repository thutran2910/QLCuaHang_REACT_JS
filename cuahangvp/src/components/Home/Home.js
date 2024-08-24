import React, { useState } from 'react';
import Header from '../../components/Header/Header'; // Đảm bảo đường dẫn chính xác
import Navbar from '../../components/Navbar/Navbar'; // Đảm bảo đường dẫn chính xác
import Footer from '../../components/Footer/Footer'; // Đảm bảo đường dẫn chính xác
import './Home.css'; // Đảm bảo file CSS đúng đường dẫn
import { Container } from 'react-bootstrap';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <Header />
      <section className='featured-products'>
      <h2>Sản phẩm nổi bật</h2>
      <div className='product-list'>
        <div className='product-item'>
          <img src='product-image.jpg' alt='Sản phẩm 1' />
          <h3>Sản phẩm 1</h3>
          <p>$100</p>
          <button>Mua ngay</button>
        </div>
      </div>
      </section>

        
      <Footer />
    </>
  );
};

export default Home;
