import React, { useState, useEffect } from 'react';
import Header from '../Header/Header'; // Đường dẫn chính xác đến Header
import Footer from '../Footer/Footer';
import './Home.css'; // Đảm bảo file CSS đúng đường dẫn
import apiClient, { endpoints } from '../../configs/API'; // Đường dẫn chính xác đến API.js

const Home = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);

  useEffect(() => {
    apiClient.get(endpoints.discountedProducts)
      .then(response => setDiscountedProducts(response.data))
      .catch(error => console.error('Error fetching discounted products:', error));
  }, []);

  return (
    <>
        <main className='main-content'>
          <section className='featured-products'>
            <h2>Sản phẩm ưu đãi</h2>
            <div className='product-list'>
              {discountedProducts.map(product => (
                <div className='product-item' key={product.id}>
                  <img src={product.image_url} alt={product.name} className='product-image' />
                  <div className='product-details'>
                    <h3 className='product-name'>{product.name}</h3>
                    <p className='product-price'>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </p>
                    <div className='product-info-row'>
                      {product.discount > 0 && (
                        <p className='product-discount'>
                          Giảm giá {Math.round(product.discount * 100)}%
                        </p>
                      )}
                      <p className='product-stock'>{product.stock_quantity} còn lại</p>
                    </div>
                    <div className='button-group'>
                      <button className='btn-add-to-cart'>Thêm vào giỏ hàng</button>
                      <button>Mua ngay</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
    </>
  );
};

export default Home;
