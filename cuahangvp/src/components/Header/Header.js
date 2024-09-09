import React, { useState, useEffect, useContext } from 'react';
import { Carousel, Container, Dropdown, Form, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import apiClient, { endpoints, removeAuthToken } from '../../configs/API'; // Import removeAuthToken
import { MyUserContext, MyDispatchContext } from '../../configs/Contexts';

const Header = ({ onCategorySelect, onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useContext(MyUserContext); // Sử dụng context để lấy thông tin người dùng
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();
  const images = [
    'https://via.placeholder.com/1200x400?text=Slide+1',
    'https://via.placeholder.com/1200x400?text=Slide+2',
    'https://via.placeholder.com/1200x400?text=Slide+3',
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get(endpoints.category);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (category) => {
    onCategorySelect(category);
    setSearchTerm(''); // Xóa từ khóa tìm kiếm khi chọn danh mục
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleLogout = () => {
    removeAuthToken();  // Xóa token
    dispatch({ type: 'logout' }); // Đăng xuất
    navigate('/');  // Quay về trang chủ
  };

  return (
    <header className="header-container">
      <div className="top-bar">
        <div className="scrolling-text">
          <span>Cửa hàng văn phòng phẩm Phương Nam chuyên cung cấp các loại đồ dùng văn phòng đa dạng, chất lượng,...</span>
        </div>
        <div className="email-info">Email: cuahangphuongnam@gmail.com</div>
      </div>

      <Carousel>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 img-carousel"
              src={image}
              alt={`slide-${index}`}
            />
            <Carousel.Caption>
              <h3>Slide {index + 1}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <nav className="navbar navbar-expand-lg navbar-dark">
        <Container>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Danh mục
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-custom">
              {categories.map((category) => (
                <Dropdown.Item key={category.id} onClick={() => handleCategorySelect(category)}>
                  {category.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Form className="d-flex ms-3" onSubmit={handleSearchSubmit}>
            <Form.Control
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-light" type="submit">Tìm kiếm</Button>
          </Form>

          <Nav.Link as={Link} to="/news" className="ms-3">  {/* Sử dụng Link để điều hướng */}
            <i className="bi bi-cart"></i> Truyện hài
          </Nav.Link>

          <Nav.Link as={Link} to="/cart" className="ms-3">  {/* Sử dụng Link để điều hướng */}
            <i className="bi bi-cart"></i> Giỏ hàng
          </Nav.Link>
          
          <Dropdown className="ms-3">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {user ? `Xin chào, ${user.username}` : 'Tài khoản'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {!user ? (
                <>
                  <Dropdown.Item as={Link} to="/login">Đăng nhập</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/register">Đăng ký</Dropdown.Item>
                </>
              ) : (
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </nav>
    </header>
  );
};

export default Header;
