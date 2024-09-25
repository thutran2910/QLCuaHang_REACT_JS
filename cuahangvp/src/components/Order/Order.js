import React, { useState, useEffect, useContext } from 'react';
import apiClient, { authApi, endpoints } from '../../configs/API';
import { MyUserContext } from '../../configs/Contexts';
import './Order.css';

const formatCurrency = (value, fractionDigits = 3) => {
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({
    shippingAddress: false,
    paymentMethod: false,
    name: false,
    email: false
  });
  const [bankTransferImage, setBankTransferImage] = useState(null);
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
            if (response.data.email) {
              setEmail(response.data.email);
            }
          } else {
            setError('Dữ liệu không đúng định dạng.');
          }
        } catch (error) {
          console.error('Lỗi khi lấy giỏ hàng của người dùng:', error);
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
          console.error('Lỗi khi lấy giỏ hàng:', error);
          setError('Có lỗi xảy ra khi tải giỏ hàng.');
        }
      }
    };

    fetchCartItems();
  }, [user]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const discountedPrice = parseFloat(item.product.discounted_price);
      return sum + (item.quantity * discountedPrice);
    }, 0);

    setTotalAmount(total);
  }, [cartItems]);

  useEffect(() => {
    if (user && user.username) {
      setName(user.username);
    }
  }, [user]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    switch (field) {
      case 'name':
        setName(value);
        setErrors((prev) => ({ ...prev, name: !value }));
        break;
      case 'email':
        setEmail(value);
        setErrors((prev) => ({ ...prev, email: !value }));
        break;
      case 'shippingAddress':
        setShippingAddress(value);
        setErrors((prev) => ({ ...prev, shippingAddress: !value }));
        break;
      case 'paymentMethod':
        setPaymentMethod(value);
        setErrors((prev) => ({ ...prev, paymentMethod: !value }));
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    setBankTransferImage(e.target.files[0]);
  };

  const handleCheckout = async () => {
    const newErrors = {
      shippingAddress: !shippingAddress,
      paymentMethod: !paymentMethod,
      name: !name && !user,
      email: !email && !user
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    const paymentMethodMap = {
      'cash': 'Thanh toán khi nhận hàng',
      'bank_transfer': 'Chuyển khoản ngân hàng',
      'online': 'Thanh toán trực tuyến'
    };

    try {
      const api = user ? authApi() : apiClient;
      const roundedTotalAmount = parseFloat(totalAmount.toFixed(2));

      const formData = new FormData();
      formData.append('shipping_address', shippingAddress);
      formData.append('payment_method', paymentMethodMap[paymentMethod]);
      formData.append('total_amount', roundedTotalAmount);
      formData.append('status', 'Đang chờ');
      formData.append('order_items', JSON.stringify(cartItems.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        priceTong: item.priceTong
      }))));
      if (!user) {
        formData.append('name', name);
        formData.append('email', email);
      }
      if (note) {
        formData.append('note', note);
      }
      if (paymentMethod === 'bank_transfer' && bankTransferImage) {
        formData.append('bank_transfer_image', bankTransferImage);
      }

      const response = await api.post(endpoints.createOrder, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 201) {
        alert('Đơn hàng đã được tạo thành công!');
        setCartItems([]);
        setShippingAddress('');
        setPaymentMethod('cash');
        setTotalAmount(0);
        setNote('');
        if (!user) {
          setName('');
          setEmail('');
        }
        setErrors({
          shippingAddress: false,
          paymentMethod: false,
          name: false,
          email: false
        });
      } else {
        setError('Không thể tạo đơn hàng.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi tạo đơn hàng.');
      console.error('Lỗi khi thanh toán:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <main className='order-content'>
      <div className='order-info'>
        <h2>Thông tin thanh toán</h2>
        {error && <p className='error-message'>{error}</p>}
        {!user && (
          <>
            <label className={errors.name ? 'error' : ''}>
              <span>Tên:</span>
              <input
                type="text"
                value={name}
                onChange={handleInputChange('name')}
                required
              />
              {errors.name && <span className='error-text'>*Vui lòng nhập tên</span>}
            </label>
            <label className={errors.email ? 'error' : ''}>
              <span>Email:</span>
              <input
                type="email"
                value={email}
                onChange={handleInputChange('email')}
                required
              />
              {errors.email && <span className='error-text'>*Vui lòng nhập email</span>}
            </label>
          </>
        )}
        <label className={errors.shippingAddress ? 'error' : ''}>
          <span>Địa chỉ giao hàng:</span>
          <textarea
            value={shippingAddress}
            onChange={handleInputChange('shippingAddress')}
            required
          />
          {errors.shippingAddress && <span className='error-text'>*Vui lòng nhập địa chỉ giao hàng</span>}
        </label>
        <label className={errors.paymentMethod ? 'error' : ''}>
          <span>Phương thức thanh toán:</span>
          <select
            value={paymentMethod}
            onChange={handleInputChange('paymentMethod')}
            required
          >
            <option value="cash">Thanh toán khi nhận hàng</option>
            <option value="bank_transfer">Chuyển khoản ngân hàng</option>
            <option value="online">Thanh toán trực tuyến</option>
          </select>
          {errors.paymentMethod && <span className='error-text'>*Vui lòng chọn phương thức thanh toán</span>}
        </label>
        {paymentMethod === 'bank_transfer' && (
          <div>
            <p>Thông tin chuyển khoản:</p>
            <ul>
              <li>Số tài khoản: 0913747367</li>
              <li>Ngân hàng: Agribank, Chi nhánh Trung tâm Sài Gòn</li>
              <li>Chủ tài khoản: Hồ Minh Anh</li>
            </ul>
            <label>
              <span>Hình ảnh chuyển khoản:</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
        )}
        <label>
          <span>Ghi chú:</span>
          <textarea
            placeholder="Nhập ghi chú nếu có..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
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
        <h2>Chi tiết đơn hàng</h2>
        {cartItems.length > 0 ? (
          <div className='order-list'>
            {cartItems.map(item => {
              const originalPrice = parseFloat(item.product.price);
              const discount = parseFloat(item.product.discount);
              const discountedPrice = parseFloat(item.product.discounted_price);
  
              return (
                <div className='order-item' key={item.product.id}>
                  <img src={item.product.image_url} alt={item.product.name} className='order-item-image' />
                  <div className='order-item-details'>
                    <h4 className='order-item-name'>{item.product.name}</h4>
                    <div className='order-item-price'>
                      {discount > 0 ? (
                        <div className='price-container'>
                          <p className='original-price'>{formatCurrency(originalPrice)}</p>
                          <p className='discounted-price'>{formatCurrency(discountedPrice)}</p>
                        </div>
                      ) : (
                        <p className='no-discount-price'>{formatCurrency(originalPrice)}</p>
                      )}
                    </div>
                    <p className='order-item-quantity'>Số lượng: {item.quantity}</p>
                    <p className='price-tong'>
                      Tổng giá: 
                          <span className='original-price'>{formatCurrency(item.priceTong)}</span>
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