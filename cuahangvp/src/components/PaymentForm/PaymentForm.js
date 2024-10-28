import React, { useState } from 'react';
import { authApi, endpoints } from '../../configs/API'; // Đảm bảo đường dẫn đúng

const PaymentForm = ({ order }) => {
    const api = authApi();
    const [bankCode, setBankCode] = useState('');
    const [language, setLanguage] = useState('vn');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post(endpoints.payment, {
                order_id: order.id,
                amount: order.total_amount,
                order_desc: `Thanh toán cho đơn hàng ${order.id}`,
                order_type: 'online',
                bank_code: bankCode,
                language: language,
            });

            const paymentUrl = response.data.payment_url;
            window.location.href = paymentUrl;
        } catch (error) {
            setError('Lỗi khi gửi yêu cầu thanh toán');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='payment-form'>
            <h3>Thông Tin Thanh Toán</h3>
            <form onSubmit={handlePayment}>
                <div>
                    <label>Chọn Ngân Hàng:</label>
                    <input
                        type="text"
                        value={bankCode}
                        onChange={e => setBankCode(e.target.value)}
                        placeholder="Nhập mã ngân hàng"
                        required
                    />
                </div>
                <div>
                    <label>Ngôn Ngữ:</label>
                    <select value={language} onChange={e => setLanguage(e.target.value)}>
                        <option value="vn">Tiếng Việt</option>
                        <option value="en">English</option>
                    </select>
                </div>
                <button type="submit" className='btn-submit' disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    );
};

export default PaymentForm;
