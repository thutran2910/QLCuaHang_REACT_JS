import React, { useState, useEffect, useContext } from 'react';
import apiClient, { authApi, endpoints } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Cart.css';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useContext(MyUserContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      let api = apiClient;  // Sử dụng apiClient mặc định
      let cartId = 11;      // Giỏ hàng mặc định khi chưa đăng nhập

      if (user) {
        api = authApi();  // Sử dụng authApi khi người dùng đã đăng nhập
        try {
          const response = await api.get(endpoints.currentUserCart);  // Lấy giỏ hàng của người dùng hiện tại
          if (response.data && response.data.cart_items) {
            setCartItems(response.data.cart_items);
          } else {
            setError('Dữ liệu không đúng định dạng.');
          }
        } catch (error) {
          console.error('Error fetching current user cart:', error);
          setError('Có lỗi xảy ra khi tải giỏ hàng của người dùng.');
        }
      } else {
        try {
          const response = await api.get(endpoints.cartDetail(cartId));  // Lấy giỏ hàng mặc định
          if (response.data && response.data.cart_items) {
            setCartItems(response.data.cart_items);
          } else {
            setError('Dữ liệu không đúng định dạng.');
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
          setError('Có lỗi xảy ra khi tải giỏ hàng.');
        }
      }

      setLoading(false);
    };

    fetchCartItems();
  }, [user]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const api = user ? authApi() : apiClient;
      const response = await api.patch(endpoints.cartItemDetail(itemId), { quantity: newQuantity });

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

  const handleRemoveItem = async (itemId) => {
    try {
      const api = user ? authApi() : apiClient;
      const response = await api.delete(endpoints.cartItemDetail(itemId));

      if (response.status === 204) {
        setCartItems(cartItems.filter(item => item.id !== itemId));
      } else {
        setError('Không thể xóa sản phẩm.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa sản phẩm.');
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
            const discountedPrice = parseFloat(item.product.discounted_price);
            const totalPrice = parseFloat(item.priceTong);

            return (
              <div className='cart-item' key={item.id}>
                <img src={item.product.image_url} alt={item.product.name} className='cart-item-image' />
                <div className='cart-item-details'>
                  <h3 className='cart-item-name'>{item.product.name}</h3>
                  <div className={`cart-item-price ${discount > 0 ? 'has-discount' : 'no-discount'}`}>
                    {discount > 0 ? (
                      <>
                        <p className='original-price'>{originalPrice} VND</p>
                        <p className='discounted-price'>{discountedPrice} VND</p>
                      </>
                    ) : (
                      <p className='original-price'>{originalPrice} VND</p>
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
                    <span>Tổng giá: </span>
                    <span className={discount > 0 ? 'original-price' : ''}>
                      {totalPrice} VND
                    </span>
                  </div>
                  <button className='remove-item-button' onClick={() => handleRemoveItem(item.id)}>
                    Xóa khỏi giỏ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Giỏ hàng của bạn trống.</p>
      )}
      <Link to="/order">
        <button className="btn-dh">Tiến hành đặt hàng</button>
      </Link>
    </main>
  );
};

export default Cart;
