import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyUserContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import './OrderList.css';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const user = useContext(MyUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const response = await authApi().get(endpoints.orderList());
          setOrders(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy danh sách hóa đơn:', error);
        }
      }
    };

    fetchOrders();
  }, [user]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className='order-list-container'>
      <h3>Danh Sách Đơn Hàng</h3>
      <div className='order-list'>
        {orders.map(order => (
          <div 
            className='order-card' 
            key={order.id} 
            onClick={() => handleOrderClick(order.id)}
          >
            <h4>Mã đơn hàng: {order.id}</h4>
            <p>Tổng thanh toán: {order.total_amount} VND</p>
            <p className='order-status'>Trạng thái: {order.status}</p> {/* Thêm class cho trạng thái */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
