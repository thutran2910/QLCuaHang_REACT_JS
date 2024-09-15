import React, { useState, useEffect, useContext } from 'react';
import { MyUserContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import './OrderList.css'; // Nhớ import CSS

const OrderList = () => {
  const [orders, setOrders] = useState([]);
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

  return (
    <div className='order-list-container'>
      <h1>Danh Sách Đơn Hàng</h1>
      <div className='order-list'>
        {orders.map(order => (
          <div className='order-card' key={order.id}>
            <header className='order-header'>
              <h2>Đơn hàng ID: {order.id}</h2>
              <p>Tổng số tiền: {parseFloat(order.total_amount).toFixed(2)} VND</p>
              <p>Địa chỉ giao hàng: {order.shipping_address}</p>
              <p>Trạng thái: {order.status}</p>
              <p>Phương thức thanh toán: {order.payment_method}</p>
              <p>Ngày tạo: {new Date(order.created_at).toLocaleDateString()}</p>
            </header>
            <section className='order-details'>
              <h3>Chi Tiết Đơn Hàng:</h3>
              <div className='order-items'>
                {order.order_items.map(item => (
                  <div className='order-item' key={item.id}>
                    <img src={item.product.image_url} alt={item.product.name} className='order-item-image' />
                    <div className='order-item-info'>
                      <p className='product-name'>Tên sản phẩm: {item.product.name}</p>
                      <p className='product-description'>Mô tả: {item.product.description || 'Không có mô tả'}</p>
                      <p>Số lượng: {item.quantity}</p>
                      <p className='product-price'>Giá mỗi sản phẩm: {parseFloat(item.product.price).toFixed(2)} VND</p>
                      <p className='item-total'>Thành tiền: {parseFloat(item.priceTong).toFixed(2)} VND</p>
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
