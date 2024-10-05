import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import { authApi } from '../../configs/API';
import axios from 'axios'; 
import CryptoJS from 'crypto-js'; 
import './OrderDetail.css'; // Nhập file CSS

const OrderDetail = () => {
  const { id } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await authApi().get(`order/${id}/`);
        setOrder(response.data);
      } catch (err) {
        setError('Lỗi khi lấy thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleThanhToanMomo = async () => {
    if (!order) return;

    try {
      const requestBody = createMomoRequestBody(order);
      const response = await axios.post('/v2/gateway/api/create', requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data && response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert('Thanh toán không thành công. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán MoMo:', error);
      alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
    }
  };

  const createMomoRequestBody = (order) => {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = `${partnerCode}${Date.now()}`;
    const orderId = `MM${Date.now()}`;
    const orderInfo = "Thanh toán hóa đơn";
    const redirectUrl = "https://momo.vn/return";
    const ipnUrl = "https://callback.url/notify";
    const amount = order.total_amount; 
    const requestType = "payWithATM";
    const extraData = "";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

    return {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi"
    };
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return null;

  return (
    <div className='order-details-modal'>
      <h3>Chi Tiết Đơn Hàng</h3>
      <p>Mã đơn hàng: {order.id}</p>
      <p className='total-amount'>Tổng thanh toán: {order.total_amount} VND</p> {/* Thay đổi class ở đây */}
      <p>Địa chỉ giao hàng: {order.shipping_address}</p>
      <p>Ghi chú: {order.note}</p>
      <p className='order-status'>Trạng thái: {order.status}</p> {/* Thay đổi class ở đây */}
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
        <button onClick={handleThanhToanMomo} className='btn-momo'>
          Thanh toán qua MoMo
        </button>
      )}

      <button onClick={() => window.history.back()}>Quay lại</button>
    </div>
  );
};

export default OrderDetail;
