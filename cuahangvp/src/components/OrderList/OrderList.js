import React, { useState, useEffect, useContext } from 'react';
import { MyUserContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import './OrderList.css'; // Nhớ import CSS

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Đang chờ'); // Mặc định là 'Đang chờ'
  const user = useContext(MyUserContext);

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

  useEffect(() => {
    if (selectedStatus === 'Tất cả') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  }, [selectedStatus, orders]);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div className='order-list-container'>
      <h3>Danh Sách Đơn Hàng</h3>
      <div className='status-buttons'>
        <button
          className={selectedStatus === 'Đang chờ' ? 'active' : ''}
          onClick={() => handleStatusChange('Đang chờ')}
        >
          Đang chờ
        </button>
        <button
          className={selectedStatus === 'Đang giao' ? 'active' : ''}
          onClick={() => handleStatusChange('Đang giao')}
        >
          Đang giao
        </button>
        <button
          className={selectedStatus === 'Đã giao' ? 'active' : ''}
          onClick={() => handleStatusChange('Đã giao')}
        >
          Đã giao
        </button>
        <button
          className={selectedStatus === 'Đã hủy' ? 'active' : ''}
          onClick={() => handleStatusChange('Đã hủy')}
        >
          Đã hủy
        </button>
      </div>
      <div className='order-list'>
        {filteredOrders.map(order => (
          <div className='order-card' key={order.id}>
            <header className='order-header'>
              <h4>Mã đơn hàng: {order.id}</h4>
              <p className='total-amount'>Tổng thanh toán: {parseFloat(order.total_amount).toFixed(3)} VND</p>
              <p>Địa chỉ giao hàng: {order.shipping_address}</p>
              <p>Ghi chú: {order.note}</p>
              <p>Trạng thái: {order.status}</p>
              <p>Phương thức thanh toán: {order.payment_method}</p>
              <p>Ngày tạo: {new Date(order.created_at).toLocaleDateString()}</p>
            </header>
            <section className='order-details'>
              <h5>Chi Tiết Đơn Hàng:</h5>
              <div className='order-items'>
                {order.order_items.map(item => (
                  <div className='order-item' key={item.id}>
                    <img src={item.product.image_url} alt={item.product.name} className='order-item-image' />
                    <div className='order-item-info'>
                      <p className='product-name'>Tên sản phẩm: {item.product.name}</p>
                      <p>Số lượng: {item.quantity}</p>
                      <p className='item-total'>Tổng giá: {parseFloat(item.priceTong).toFixed(3)} VND</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
