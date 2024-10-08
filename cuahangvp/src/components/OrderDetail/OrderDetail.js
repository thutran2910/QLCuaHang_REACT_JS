import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi } from '../../configs/API';
import CryptoJS from 'crypto-js';
import './OrderDetail.css'; // Nhập file CSS

const OrderDetail = () => {
  const api = authApi();
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Mã đơn hàng không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`order/${orderId}/`);
        setOrder(response.data);
      } catch (err) {
        setError('Lỗi khi lấy thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Thêm orderId vào mảng phụ thuộc

  const handleThanhToanVNPay = async (item) => {
    try {
      const vnpayUrl = createVNPayRequest(item);
      window.location.href = vnpayUrl; // Chuyển hướng tới VNPay
    } catch (error) {
      console.error('Lỗi khi thanh toán VNPay:', error);
      alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
    }
  };

  const createVNPayRequest = (item) => {
    const amount = item.total_amount * 100; // Chuyển đổi VND sang đơn vị nhỏ nhất
    const orderId = `MM${Date.now()}`; // Tạo orderId
    const orderInfo = `Thanh toán đơn hàng ${orderId}`;
    const returnUrl = 'http://localhost:8000/payment/payment/result/'; // URL trả về
    const vnpTmnCode = 'W1CI3KUS'; // Mã cửa hàng VNPay
    const vnpSecretKey = 'LXMZ6RDOJSLFB1G1XHZJGN2KKTI3P5TK'; // Khóa bí mật VNPay
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // URL VNPay
    const ipAddress = '127.0.0.1'; // IP địa chỉ

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_TmnCode: vnpTmnCode,
      vnp_TransactionNo: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'billpayment',
      vnp_Amount: amount,
      vnp_Locale: 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddress,
      vnp_CreateDate: new Date().toISOString().slice(0, 19).replace('T', '').replace(/-/g, '').replace(/:/g, '') // Định dạng YYYYMMDDHHMMSS
    };

    const sortedKeys = Object.keys(vnpParams).sort();
    const queryString = sortedKeys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(vnpParams[key])}`).join('&');
    const hashString = queryString + `&vnp_Key=${vnpSecretKey}`;
    const signature = CryptoJS.HmacSHA256(hashString, vnpSecretKey).toString(CryptoJS.enc.Hex);
    
    vnpParams.vnp_SecureHash = signature;

    // Tạo URL VNPay
    const vnpayUrl = vnpUrl + '?' + new URLSearchParams(vnpParams).toString();
    return vnpayUrl;
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return null;

  return (
    <div className='order-details-modal'>
      <h3>Chi Tiết Đơn Hàng</h3>
      <p>Mã đơn hàng: {order.id}</p>
      <p className='total-amount'>Tổng thanh toán: {order.total_amount} VND</p>
      <p>Địa chỉ giao hàng: {order.shipping_address}</p>
      <p>Ghi chú: {order.note}</p>
      <p className='order-status'>Trạng thái: {order.status}</p>
      <p>Phương thức thanh toán: {order.payment_method}</p>
      <p>Ngày tạo: {new Date(order.created_at).toLocaleDateString()}</p>
      <h5>Chi Tiết Đơn Hàng:</h5>
      <div className='order-items'>
        {order.order_items.map(item => (
          <div className='order-item' key={item.id}>
            <img src={item.product.image_url} alt={item.product.name} className='order-item-image' />
            <div className='order-item-info'>
              <p className='product-name'>Tên sản phẩm: {item.product.name}</p>
              <p>Số lượng: {item.quantity}</p>
              <p className='item-total'>Tổng giá: {item.priceTong} VND</p>
            </div>
          </div>
        ))}
      </div>

      {order.payment_method === 'Thanh toán trực tuyến' && (
        <button onClick={() => handleThanhToanVNPay(order)} className='btn-vnpay'>
          Thanh toán qua VNPay
        </button>
      )}

      <button onClick={() => window.history.back()}>Quay lại</button>
    </div>
  );
};

export default OrderDetail;
