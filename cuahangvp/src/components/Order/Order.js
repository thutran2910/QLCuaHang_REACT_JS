import React, { useState, useEffect, useContext } from 'react';
import apiClient, { authApi, endpoints } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Order.css';

const formatCurrency = (value, fractionDigits = 3) => {
  if (isNaN(value)) return value;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
};

const Order = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);
  const [name, setName] = useState(''); // For users not logged in
  const [email, setEmail] = useState(''); // For users not logged in
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
      const originalPrice = parseFloat(item.product.price);
      const discount = parseFloat(item.product.discount);
      const discountedPrice = discount > 0 ? originalPrice * (1 - discount) : originalPrice;
      return sum + (item.quantity * discountedPrice);
    }, 0);

    setTotalAmount(total);
  }, [cartItems]);

  const handleCheckout = async () => {
    try {
      const api = user ? authApi() : apiClient;
      const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));

      const orderData = {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_amount: roundedTotalAmount,
        status: 'Pending',
        order_items: cartItems.map(item => ({
          product: item.product.id, // Use product ID instead of cart item ID
          quantity: item.quantity,
          priceTong: item.priceTong
        }))
      };

      if (!user) {
        orderData.name = name;
        orderData.email = email;
      }

      const response = await api.post(endpoints.createOrder, orderData);

      if (response.status === 201) {
        alert('Đơn hàng đã được tạo thành công!');
        setCartItems([]);
        setShippingAddress('');
        setPaymentMethod('cash');
        setTotalAmount(0);
        if (!user) {
          setName('');
          setEmail('');
        }
      } else {
        setError('Không thể tạo đơn hàng.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo đơn hàng.');
      console.error('Error during checkout:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <main className='order-content'>
      <div className='order-info'>
        <h2>Thông tin thanh toán</h2>
        {!user && (
          <>
            <label>
              Tên:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </>
        )}
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
              const discountedPrice = discount > 0 ? originalPrice * (1 - discount) : originalPrice;

              return (
                <div className='order-item' key={item.product.id}>
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
                    <p className='order-item-quantity'>Số lượng: {item.quantity}</p>
                    <p className='price-tong'>
                      Tổng giá: 
                      {discount > 0 ? (
                        <>
                          <span className='original-price'>
                            {formatCurrency(item.priceTong)}
                          </span>
                          <span className='discounted-price'>
                            {formatCurrency(item.quantity * discountedPrice)}
                          </span>
                        </>
                      ) : (
                        <span>{formatCurrency(item.priceTong)}</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>Giỏ hàng của bạn đang trống.</p>
        )}
      </div>
    </main>
  );
};

export default Order;
