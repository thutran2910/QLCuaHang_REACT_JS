import React, { useState, useEffect } from 'react';
import apiClient, { endpoints } from '../../configs/API';  
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartId = 11; // Cứng mã hóa cartId là 11

  useEffect(() => {
    const fetchCartItems = async () => {
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
  }, [cartId]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    try {
      const response = await apiClient.patch(endpoints.cartItemDetail(itemId), { quantity: newQuantity });
      if (response.status === 200) {
        setCartItems(cartItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
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
          {cartItems.map(item => (
            <div className='cart-item' key={item.id}>
              <img src={item.product.image_url} alt={item.product.name} className='cart-item-image' />
              <div className='cart-item-details'>
                <h3 className='cart-item-name'>{item.product.name}</h3>
                <p className='cart-item-price'>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.price)}
                </p>
                <p className='cart-item-discount'>
                  Giảm giá: {item.product.discount * 100}%
                </p>
                <input
                  type='number'
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  min='1'
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Giỏ hàng của bạn trống.</p>
      )}
    </main>
  );
};

export default Cart;
