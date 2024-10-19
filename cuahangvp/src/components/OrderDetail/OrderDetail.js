import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, getAuthToken } from '../../configs/API';
import { endpoints } from '../../configs/API';
import './OrderDetail.css';

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
    }, [orderId]);

    const handleThanhToanVNPay = async () => {
        if (!getAuthToken()) {
            alert('Bạn cần đăng nhập trước khi thanh toán.');
            return;
        }
    
        const paymentData = {
            order_type: 'bill',
            order_id: orderId,
            amount: order.total_amount,
            order_desc: `Thanh toán cho đơn hàng ${orderId}`,
            shipping_address: order.shipping_address,
            name: order.customer_name,
            email: order.customer_email,
            bank_code: '', // Nếu cần, hãy chắc chắn rằng trường này có giá trị hợp lệ
            language: 'vn',
        };
        
        console.log('Payment Data:', paymentData); // Ghi log dữ liệu
        
        const response = await api.post(endpoints.createPayment(), paymentData);
        
    
        try {
            const response = await api.post(endpoints.createPayment(), paymentData);
            window.location.href = response.data.paymentUrl; // Chuyển hướng tới VNPay
        } catch (error) {
            console.error('Lỗi khi thanh toán VNPay:', error.response ? error.response.data : error);
            alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại!');
        }
    };
    
    

    // Tương tự cho MoMo (nếu cần)
    const handleThanhToanMoMo = async () => {
        // Đoạn mã tương tự như VNPay
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
                <>
                    <button onClick={handleThanhToanVNPay} className='btn-vnpay'>
                        Thanh toán qua VNPay
                    </button>
                    <button onClick={handleThanhToanMoMo} className='btn-momo'>
                        Thanh toán qua MoMo
                    </button>
                </>
            )}

            <button onClick={() => window.history.back()}>Quay lại</button>
        </div>
    );
};

export default OrderDetail;
