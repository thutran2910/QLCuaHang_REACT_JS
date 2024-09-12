import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiClient, { endpoints, authApi } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]); // Thêm state cho reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const user = useContext(MyUserContext);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`${endpoints.productDetail}${id}/`);
        setProduct(response.data);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiClient.get(`${endpoints.reviews}?product_id=${id}`); // Gọi API lấy reviews
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000); // Hiển thị thông báo trong 2 giây
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  if (!product) return <p>Không có sản phẩm nào để hiển thị.</p>;

  const originalPrice = parseFloat(product.price);
  const discountedPrice = product.discount > 0 ? originalPrice * (1 - parseFloat(product.discount)) : null;
  const discountPercentage = product.discount > 0 ? Math.round(parseFloat(product.discount) * 100) : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(value);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const api = user ? authApi() : apiClient; // Sử dụng authApi nếu đã đăng nhập
      const cartId = user ? undefined : 11; // Sử dụng cartId cố định nếu không đăng nhập

      const response = await api.post(endpoints.cartItems, {
        product: productId,
        quantity,
        cartId
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
    <div className="product-page-container">
      {message && (
        <div className="alert alert-info">{message}</div>
      )}
      <div className="product-page-main">
        <div className="product-page-image-container">
          <img src={product.image_url} alt={product.name} className="product-page-image" />
        </div>
        <div className="product-page-details">
          <h1 className="product-page-name">{product.name}</h1>
          <p className="product-page-description">{product.description}</p>
  
          <div className="product-page-prices">
            <p className="product-label">Giá sản phẩm:</p>
            <div className="price-wrapper">
              {discountedPrice !== null ? (
                <>
                  <p className="product-page-price original-price">{formatCurrency(originalPrice)}</p>
                  <p className="product-page-price discounted-price">{formatCurrency(discountedPrice)}</p>
                </>
              ) : (
                <p className="product-page-price normal-price">{formatCurrency(originalPrice)}</p>
              )}
            </div>
          </div>
  
          <p className="product-page-stock">Số lượng tồn kho: {product.stock_quantity}</p>
  
          <div className="product-page-actions">
            <button className="page-btn-add-to-cart" onClick={() => handleAddToCart(product.id)}>Thêm vào giỏ hàng</button>
            <button className="page-btn-buy-now">Mua ngay</button>
          </div>
        </div>
        {discountPercentage > 0 && (
          <div className="product-page-discount-tag">
            Giảm {discountPercentage}%
          </div>
        )}
      </div>
      
      {/* Hiển thị đánh giá của sản phẩm */}
      <div className="product-reviews">
        <h2>Đánh giá sản phẩm</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>{review.username}</strong> ({review.first_name} {review.last_name})</p>
              <p>Đánh giá: {review.rating} sao</p>
              <p>{review.comment}</p>
              <p>Ngày tạo: {new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );  
};

export default Product;
