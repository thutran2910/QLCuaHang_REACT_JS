
import React, { useState, useEffect } from 'react';
import apiClient, { endpoints } from '../../configs/API';
import './Home.css';

const Home = ({ category, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let url;

        if (searchTerm) {
          url = endpoints.searchProducts(searchTerm);
        } else if (category) {
          url = endpoints.productsByCategory(category.id);
        } else {
          url = endpoints.discountedProducts;
        }

        const response = await apiClient.get(url);

        // Kiểm tra dữ liệu nhận được từ API
        console.log('Dữ liệu nhận được từ API:', response.data);

        const productsWithCorrectPrice = response.data.map(product => {
          const price = parseFloat(product.price);
          console.log('Giá sau khi chuyển đổi:', price);
          return {
            ...product,
            price
          };
        });

        setProducts(productsWithCorrectPrice);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchTerm]);

  const formatCurrency = (value) => {
    if (isNaN(value)) return value;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(value);
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await apiClient.post(endpoints.cartItems, {
        product: productId,
        quantity: 1
      });

      if (response.status === 201) {
        setMessage('Sản phẩm đã được thêm vào giỏ hàng!');
      } else {
        setMessage('Không thể thêm sản phẩm vào giỏ hàng.');
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <main className='main-content'>
      {message && <div className="alert alert-info">{message}</div>}
      <section className='featured-products'>
        <h2>
          {searchTerm
            ? `Sản phẩm bạn đang muốn tìm kiếm: ${searchTerm}`
            : category
            ? `Sản phẩm thuộc danh mục: ${category.name}`
            : 'Sản phẩm ưu đãi'}
        </h2>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          <div className='product-list'>
            {products.map(product => {
              const originalPrice = product.price;
              const discountedPrice = product.discount > 0 ? originalPrice * (1 - product.discount) : null;
              const discountPercentage = product.discount > 0 ? Math.round(product.discount * 100) : 0;

              return (
                <div className='product-item' key={product.id}>
                  <div className='product-image-container'>
                    <img src={product.image_url} alt={product.name} className='product-image' />
                    {discountedPrice !== null && (
                      <div className='discount-tag'>-{discountPercentage}%</div>
                    )}
                  </div>
                  <div className='product-details'>
                    <h3 className='product-name'>{product.name}</h3>
                    <div className='product-prices'>
                      {discountedPrice === null ? (
                        <p className='product-price normal-price'>
                          {formatCurrency(originalPrice)}
                        </p>
                      ) : (
                        <>
                          <p className='product-price original-price'>
                            {formatCurrency(originalPrice)}
                          </p>
                          <p className='product-price discounted-price'>
                            {formatCurrency(discountedPrice)}
                          </p>
                        </>
                      )}
                    </div>
                    <div className='button-group'>
                      <button className='btn-add-to-cart' onClick={() => handleAddToCart(product.id)}>
                        Thêm vào giỏ
                      </button>
                      <button>Mua ngay</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Không có sản phẩm nào để hiển thị.</p>
        )}
      </section>
    </main>
  );
};

export default Home;
