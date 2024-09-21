import React, { useState, useEffect, useContext } from 'react';
import apiClient, { endpoints, authApi } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Home.css';
import { useNavigate, Link } from 'react-router-dom';

const Home = ({ category, searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const user = useContext(MyUserContext);
  const navigate = useNavigate(); // Sử dụng useNavigate thay vì useHistory

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
        const productsWithCorrectPrice = response.data.map(product => {
          const price = parseFloat(product.price);
          const discountedPrice = parseFloat(product.discounted_price);
          return {
            ...product,
            price,
            discountedPrice
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

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const formatCurrency = (value) => {
    if (isNaN(value)) return value;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(value);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const api = user ? authApi() : apiClient;
      const cartId = user ? undefined : 11;

      const response = await api.post(endpoints.cartItems, {
        product: productId,
        quantity,
        cartId
      });

      if (response.status === 201) {
        setMessage('Sản phẩm đã được thêm vào giỏ hàng!');
        return true; // Trả về true khi thành công
      } else {
        setMessage('Không thể thêm sản phẩm vào giỏ hàng.');
        return false; // Trả về false khi không thành công
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
      console.error('Error adding to cart:', error);
      return false; // Trả về false khi có lỗi
    }
  };

  const handleBuyNow = async (productId) => {
    const added = await handleAddToCart(productId);
    if (added) {
      navigate('/cart'); // Sử dụng navigate để chuyển hướng
    }
  };

  return (
    <main className='main-content'>
      {message && <div className="alert alert-info">{message}</div>}
      <section className='featured-products'>
        <h2>
          {searchTerm
            ? `Từ khóa bạn đang muốn tìm kiếm ' ${searchTerm}'`
            : category
            ? `Sản phẩm thuộc danh mục ${category.name}`
            : 'Sản phẩm đang được ưu đãi'}
        </h2>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          <div className='product-list'>
            {products.map(product => {
              const originalPrice = product.price;
              const discountedPrice = product.discountedPrice;

              return (
                <div className='product-item' key={product.id}>
                  <div className='product-image-container'>
                    <Link to={`/product/${product.id}`}>
                      <img src={product.image_url} alt={product.name} className='product-image' />
                    </Link>
                    {product.discount > 0 && (
                      <div className='discount-tag'>-{Math.round(product.discount * 100)}%</div>
                    )}
                  </div>
                  <div className='product-details'>
                    <h3 className='product-name'>{product.name}</h3>
                    <div className='product-prices'>
                      {product.discount > 0 ? (
                        <>
                          <p className='product-price original-price'>
                            {formatCurrency(originalPrice)}
                          </p>
                          <p className='product-price discounted-price'>
                            {formatCurrency(discountedPrice)}
                          </p>
                        </>
                      ) : (
                        <p className='product-price discounted-price'>
                          {formatCurrency(originalPrice)}
                        </p>
                      )}
                    </div>
                    <div className='button-group'>
                      <button className='btn-add-to-cart' onClick={() => handleAddToCart(product.id)}>
                        Thêm vào giỏ
                      </button>
                      <button onClick={() => handleBuyNow(product.id)}>Mua ngay</button>
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
