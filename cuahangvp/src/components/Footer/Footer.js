// src/components/Footer/Footer.js
import React from 'react';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import PhoneIcon from '@mui/icons-material/Phone';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer-container'>
      <MDBRow className='footer-content'>
        <MDBCol md='3' className='footer-item'>
          <h5>Giới thiệu</h5>
          <p><a href='/register'>Đăng ký</a></p>
          <p><a href='/login'>Đăng nhập</a></p>
          <p><a href='/search'>Tìm kiếm</a></p>
        </MDBCol>
        <MDBCol md='3' className='footer-item'>
          <h5>Các chính sách</h5>
          <p><a href='/terms'>Điều khoản sử dụng</a></p>
          <p><a href='/security'>Chính sách bảo mật</a></p>
          <p><a href='/terms2'>Chính sách bán hàng</a></p>
        </MDBCol>
        <MDBCol md='3' className='footer-item'>
          <h5>Hỗ trợ khách hàng</h5>
          <p><a href='/guide'>Hướng dẫn mua hàng</a></p>
          <p><a href='/payment'>Hướng dẫn thanh toán</a></p>
          <p><a href='/question'>Câu hỏi thường gặp</a></p>
        </MDBCol>
        <MDBCol md='3' className='footer-item'>
          <h5>Thông tin liên hệ</h5>
          <p><FmdGoodIcon /> Địa chỉ: 65 Lê Lợi, Quận 1, Thành phố Hồ Chí Minh</p>
          <p><PhoneIcon /> Số điện thoại: 0954 674 126</p>
        </MDBCol>
      </MDBRow>
      <div className='scroll-text'>
        <span>© 2024 Cửa hàng văn phòng phẩm Phương Nam</span>
      </div>
    </div>
  );
}

export default Footer;
