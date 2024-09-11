import React, { useState, useEffect, useContext } from 'react';
import apiClient, { endpoints } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Cart.css';

// Định nghĩa hàm formatCurrency
const formatCurrency = (value) => {
  if (isNaN(value)) return value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 3, // Hiển thị số thập phân
    maximumFractionDigits: 3  // Hiển thị số thập phân
  }).format(value);
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useContext(MyUserContext); // Nhận thông tin người dùng từ Context

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartId = user ? user.cart_id : 11; // Sử dụng cart_id của người dùng hoặc giỏ hàng mặc định

      if (!cartId) return;  // Nếu không có cart_id, không thực hiện gọi API

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(endpoints.cartDetail(cartId));
        if (response.data && response.data.cart_items) {
          setCartItems(response.data.cart_items);
        } else {
          setError('Dữ liệu không đúng định dạng.');
        }
      } catch (error) {
        setError('Có lỗi xảy ra khi tải giỏ hàng.');
        console.error('Error fetching cart items:', error); // Ghi log lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]); // Theo dõi sự thay đổi của user

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1

    try {
      const response = await apiClient.patch(endpoints.cartItemDetail(itemId), { quantity: newQuantity });
      if (response.status === 200) {
        const updatedItem = response.data;
        setCartItems(cartItems.map(item =>
          item.id === itemId ? updatedItem : item
        ));
      } else {
        setError('Không thể cập nhật số lượng.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật số lượng.');
    }
  };

  return (
    <main className='cart-content'>
      <h2>Chi tiết giỏ hàng</h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : error ? (
        <p>{error}</p>
      ) : cartItems.length > 0 ? (
        <div className='cart-list'>
          {cartItems.map(item => {
            const originalPrice = parseFloat(item.product.price);
            const discount = parseFloat(item.product.discount);
            const quantity = item.quantity;
            const discountedPrice = discount > 0 ? originalPrice * (1 - discount) : originalPrice; // Giá sau giảm
            const totalOriginalPrice = originalPrice * quantity; // Tổng giá gốc
            const totalDiscountedPrice = discount > 0 ? discountedPrice * quantity : totalOriginalPrice; // Tổng giá giảm

            return (
              <div className='cart-item' key={item.id}>
                <img src={item.product.image_url} alt={item.product.name} className='cart-item-image' />
                <div className='cart-item-details'>
                  <h3 className='cart-item-name'>{item.product.name}</h3>
                  <div className={`cart-item-price ${discount > 0 ? 'has-discount' : 'no-discount'}`}>
                    {discount > 0 ? (
                      <>
                        <p className='original-price'>
                          {formatCurrency(originalPrice)}
                        </p>
                        <p className='discounted-price'>
                          {formatCurrency(discountedPrice)}
                        </p>
                      </>
                    ) : (
                      <p className='original-price'>
                        {formatCurrency(originalPrice)}
                      </p>
                    )}
                  </div>
                  {discount > 0 && (
                    <div className='cart-item-discount'>-{Math.round(discount * 100)}%</div>
                  )}
                  <div className='cart-item-quantity'>
                    <button onClick={() => handleQuantityChange(item.id, Math.max(item.quantity - 1, 1))}>-</button>
                    <input
                      type='number'
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      min='1'
                    />
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className={`price-tong ${discount > 0 ? 'has-discount' : 'no-discount'}`}>
                    <span>Tổng giá:</span>
                    <span className={discount > 0 ? 'original-price' : ''}>
                      {formatCurrency(totalOriginalPrice)}
                    </span>
                    {discount > 0 && (
                      <span className='discounted-price'>
                        {formatCurrency(totalDiscountedPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Giỏ hàng của bạn trống.</p>
      )}
    </main>
  );
};

export default Cart;
