import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient, { endpoints, authApi } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');
  const user = useContext(MyUserContext);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleWriteReviewClick = () => {
    if (user) {
      setIsWritingReview(true);
    } else {
      setMessage2('Bạn cần đăng nhập để thực hiện đánh giá.');
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0 || comment.trim() === '') {
      setMessage2('Vui lòng nhập đủ thông tin.');
      return;
    }

    try {
      const response = await authApi().post(endpoints.reviews, {
        product: id,
        rating,
        comment,
      });

      if (response.status === 201) {
        setMessage2('Đánh giá của bạn đã được gửi thành công!');
        setIsWritingReview(false);
        setRating(0);
        setComment('');
      } else {
        setMessage2('Không thể gửi đánh giá.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage2('Có lỗi xảy ra khi gửi đánh giá.');
    }
  };

  const handleBuyNow = async (productId) => {
    const added = await handleAddToCart(productId);
    if (added) {
      navigate('/cart'); // Chuyển hướng đến giỏ hàng
    }
  };

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
        const response = await apiClient.get(`${endpoints.reviews}?product_id=${id}`);
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
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  if (!product) return <p>Không có sản phẩm nào để hiển thị.</p>;

  const originalPrice = parseFloat(product.price);
  const discountedPrice = parseFloat(product.discounted_price);
  const discountPercentage = parseFloat(product.discount);

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
        return true; // Trả về true nếu thêm thành công
      } else {
        setMessage('Không thể thêm sản phẩm vào giỏ hàng.');
        return false; // Trả về false nếu không thành công
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
      console.error('Error adding to cart:', error);
      return false; // Trả về false nếu có lỗi
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="product-page-container">
      {message && (
        <div className="alert alert-info">{message}</div>
      )}
      {message2 && (
        <div className="alert alert-info">{message2}</div>
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
              {product.discount > 0 ? (
                <>
                  <p className='product-price original-price'>
                    {originalPrice} VND
                  </p>
                  <p className='product-price discounted-price'>
                    {discountedPrice} VND
                  </p>
                </>
              ) : (
                <p className='product-price discounted-price'>
                  {originalPrice} VND
                </p>
              )}
            </div>
          </div>

          <p className="product-page-stock">Số lượng tồn kho: {product.stock_quantity}</p>

          <div className="product-page-actions">
            <button className="page-btn-add-to-cart" onClick={() => handleAddToCart(product.id)}>Thêm vào giỏ hàng</button>
            <button className="page-btn-buy-now" onClick={() => handleBuyNow(product.id)}>Mua ngay</button>
          </div>
        </div>
        {discountPercentage > 0 && (
          <div className="product-page-discount-tag">
            Giảm giá {discountPercentage * 100}%
          </div>
        )}
      </div>

      {/* HIỂN THỊ ĐÁNH GIÁ SẢN PHẨM */}
      <div className="product-reviews-section">
        <h2>Những đánh giá của khách hàng về sản phẩm</h2>
        <h5 className="write-review-button" onClick={handleWriteReviewClick}>Viết đánh giá</h5>
      </div>
      <div className="product-reviews">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p><strong>{review.username}</strong> ({review.first_name} {review.last_name})</p>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
              <p>{review.comment}</p>
              <p className="review-date">Ngày tạo: {new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>

      {/* HIỆN BẢNG ĐÁNH GIÁ */}
      {isWritingReview && user && (
        <div className="write-review-box">
          <button className="close-button" onClick={() => setIsWritingReview(false)}>X</button>
          <h3>Đánh giá sản phẩm</h3>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <textarea
            placeholder="Nhập nhận xét của bạn"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="submit-button" onClick={handleSubmitReview}>Gửi đánh giá</button>
        </div>
      )}
    </div>
  );
};

export default Product;
