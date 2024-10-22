import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentForm = () => {
    const location = useLocation();
    const { order } = location.state || {};
    
    const [amount] = useState(order ? order.total_amount : '');
    const [orderId] = useState(order ? order.id : '');
    const [orderDesc, setOrderDesc] = useState('');
    const [orderType, setOrderType] = useState('other'); // Giá trị mặc định
    const [bankCode, setBankCode] = useState('');
    const [language, setLanguage] = useState('vn');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://192.168.100.169:8000/create_payment_url/', {
                order_id: orderId,
                amount: amount * 100, // VNPay yêu cầu số tiền theo đơn vị VND
                order_desc: orderDesc,
                order_type: orderType,
                bank_code: bankCode,
                language: language,
            });
            // Handle response if necessary
            window.location.href = response.data.paymentUrl; // Chuyển hướng đến trang thanh toán
        } catch (error) {
            console.error("There was an error processing the payment!", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Mã đơn hàng:</label>
                <input type="text" value={orderId} readOnly />
            </div>
            <div>
                <label>Số tiền:</label>
                <input type="number" value={amount} readOnly />
            </div>
            <div>
                <label>Ghi chú:</label>
                <input type="text" value={orderDesc} onChange={(e) => setOrderDesc(e.target.value)} />
            </div>
            <div>
                <label>Loại đơn hàng:</label>
                <input type="text" value={orderType} onChange={(e) => setOrderType(e.target.value)} />
            </div>
            <div>
                <label>Mã ngân hàng (tùy chọn):</label>
                <input type="text" value={bankCode} onChange={(e) => setBankCode(e.target.value)} />
            </div>
            <div>
                <label>Ngôn ngữ:</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="vn">Tiếng Việt</option>
                    <option value="en">Tiếng Anh</option>
                </select>
            </div>
            <button type="submit">Thanh toán</button>
        </form>
    );
};

export default PaymentForm;
