import React, { useState, useEffect, useContext } from 'react';
import apiClient, { authApi, endpoints } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Order.css';

const formatCurrency = (value) => {
  if (isNaN(value)) return value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(value);
};

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const user = useContext(MyUserContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      let api = apiClient;
      let cartId = 11;

      if (user) {
        api = authApi();
        try {
          const response = await api.get(endpoints.currentUserCart);
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
          const response = await api.get(endpoints.cartDetail(cartId));
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
    };

    fetchCartItems();
  }, [user]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const discount = parseFloat(item.product.discount);
      const originalPrice = parseFloat(item.product.price);
      const quantity = item.quantity;
      const discountedPrice = discount > 0 ? originalPrice * (1 - discount) : originalPrice;
      return sum + (discount > 0 ? discountedPrice * quantity : parseFloat(item.priceTong));
    }, 0);

    setTotalAmount(total);
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      const api = user ? authApi() : apiClient;
      const response = await api.post(endpoints.createOrder, {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        order_items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.priceTong
        }))
      });

      if (response.status === 201) {
        alert('Đơn hàng đã được tạo thành công!');
        setCartItems([]);
        setShippingAddress('');
        setPaymentMethod('cash');
        setTotalAmount(0);
      } else {
        setError('Không thể tạo đơn hàng.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo đơn hàng.');
    }
  };

  return (
    <main className='order-content'>
      <div className='order-info'>
        <h2>Thông tin thanh toán</h2>
        <label>
          Địa chỉ giao hàng:
          <textarea
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
          />
        </label>
        <label>
          Phương thức thanh toán:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="cash">Tiền mặt</option>
            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
            <option value="online">Thanh toán trực tuyến</option>
          </select>
        </label>
        <label>
          Ghi chú:
          <textarea
            placeholder="Nhập ghi chú nếu có..."
            value={shippingAddress} // Reusing shipping address state for notes; adjust if needed
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </label>
        <div className='order-total'>
          <span>Tổng thanh toán: {formatCurrency(totalAmount)}</span>
        </div>
        <button className='btn-checkout' onClick={handleCheckout}>
          Xác nhận đặt hàng
        </button>
      </div>

      <div className='order-details'>
        <h2>Chi tiết hóa đơn</h2>
        {error && <p>{error}</p>}
        {cartItems.length > 0 ? (
          <div className='order-list'>
            {cartItems.map(item => {
              const originalPrice = parseFloat(item.product.price);
              const discount = parseFloat(item.product.discount);
              const quantity = item.quantity;
              const discountedPrice = discount > 0 ? originalPrice * (1 - discount) : originalPrice;
              const totalOriginalPrice = parseFloat(item.priceTong);
              const totalDiscountedPrice = discount > 0 ? discountedPrice * quantity : totalOriginalPrice;

              return (
                <div className='order-item' key={item.id}>
                  <img src={item.product.image_url} alt={item.product.name} className='order-item-image' />
                  <div className='order-item-details'>
                    <h4 className='order-item-name'>{item.product.name}</h4>
                    <div className='order-item-price'>
                      {discount > 0 ? (
                        <>
                          <p className='original-price'>{formatCurrency(originalPrice)}</p>
                          <p className='discounted-price'>{formatCurrency(discountedPrice)}</p>
                        </>
                      ) : (
                        <p className='no-discount-price'>{formatCurrency(originalPrice)}</p>
                      )}
                    </div>
                    {discount > 0 && (
                      <div className='order-item-discount'>-{Math.round(discount * 100)}%</div>
                    )}
                    <div className='order-item-quantity'>
                      <span>Số lượng: {quantity}</span>
                    </div>
                    <div className='price-tong'>
                      Tổng giá:  
                      {discount > 0 ? (
                        <>
                          <span className='original-price'>
                            {formatCurrency(totalOriginalPrice)}
                          </span>
                          <span className='discounted-price'>
                            {formatCurrency(totalDiscountedPrice)}
                          </span>
                        </>
                      ) : (
                        <span>{formatCurrency(totalOriginalPrice)}</span>
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
      </div>
    </main>
  );
};

export default Order;
