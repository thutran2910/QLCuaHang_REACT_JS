import React, { useState, useEffect } from 'react';
import apiClient, { endpoints } from '../../configs/API';
import './Home.css';

const Home = ({ category, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Thông báo

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
        console.log('Dữ liệu nhận được:', response.data);

        // Chuyển đổi giá từ chuỗi thành số thực
        const productsWithCorrectPrice = response.data.map(product => ({
          ...product,
          price: parseFloat(product.price) // Chuyển đổi giá thành số thực
        }));

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
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
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
            {products.map(product => (
              <div className='product-item' key={product.id}>
                <img src={product.image_url} alt={product.name} className='product-image' />
                <div className='product-details'>
                  <h3 className='product-name'>{product.name}</h3>
                  <p className='product-price'>
                    {formatCurrency(product.price)}
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
                    <button className='btn-add-to-cart' onClick={() => handleAddToCart(product.id)}>
                      Thêm vào giỏ hàng
                    </button>
                    <button>Mua ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có sản phẩm nào để hiển thị.</p>
        )}
      </section>
    </main>
  );
};

export default Home;
