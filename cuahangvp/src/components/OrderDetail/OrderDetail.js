import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';
import './OrderDetail.css';

const OrderDetail = () => {
    const api = authApi();
    const navigate = useNavigate();
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
    }, [orderId]);

    // Kiểm tra tham số truy vấn để hiển thị thông báo thanh toán thành công
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentSuccess = queryParams.get('payment_success');

        if (paymentSuccess === 'true') {
            alert('Thanh toán thành công!');
        }
    }, []);

    const handleThanhToanVNPay = async () => {
        if (order) {
            try {
                // Gửi yêu cầu tạo URL thanh toán đến backend
                const response = await api.post(endpoints.payment, {
                    order_id: order.id,  // Chỉ gửi order_id và các thông tin cần thiết
                });

                // Backend trả về URL thanh toán, frontend chỉ cần chuyển hướng
                const paymentUrl = response.data.payment_url;
                window.location.href = paymentUrl;
            } catch (error) {
                setError('Lỗi khi gửi yêu cầu thanh toán');
            }
        } else {
            setError('Thông tin đơn hàng không có');
        }
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
                <button onClick={handleThanhToanVNPay} className='btn-vnpay'>
                    Thanh toán qua VNPay
                </button>
            )}

            <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );
};

export default OrderDetail;