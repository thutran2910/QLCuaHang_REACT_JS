import React, { useState, useEffect, useContext } from 'react';
import { Carousel, Container, Dropdown, Form, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import apiClient, { endpoints, removeAuthToken } from '../../configs/API';
import { MyUserContext, MyDispatchContext } from '../../configs/Contexts';
import { FaShoppingCart, FaComments } from 'react-icons/fa';

const Header = ({ onCategorySelect, onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const images = [
    'https://media.istockphoto.com/id/649195666/vi/anh/v%E1%BA%ADt-t%C6%B0-v%C4%83n-ph%C3%B2ng-v%E1%BA%ABn-c%C3%B2n-s%E1%BB%91ng.jpg?s=1024x1024&w=is&k=20&c=Z5-2-jnMm7C5NsV31a1rw74_uc1ptbzxtWRNt7GKIKY=',
    'https://toplist.vn/images/800px/nha-sach-alphabook-316506.jpg',
    'https://i.pinimg.com/736x/d7/3e/55/d73e551e54caf6ef7639f382bea8be5d.jpg',
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
    setSearchTerm('');
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleLogout = () => {
    removeAuthToken();
    dispatch({ type: 'logout' });
    navigate('/');
  };

  const handleChatClick = () => {
    if (!user) {
      navigate('/login'); // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
    } else {
      navigate('/chat'); // Điều hướng đến trang chat nếu đã đăng nhập
    }
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
            />
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

                  <Nav.Link as={Link} to="/news" className={`ms-3 ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
          <i className="bi bi-cart"></i> Blog
        </Nav.Link>

        <Nav.Link as={Link} to="/cart" className={`ms-3 ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
          <FaShoppingCart /> Giỏ
        </Nav.Link>

        <Nav.Link as={Link} to="/orderlist" className={`ms-3 ${activeTab === 'orderlist' ? 'active' : ''}`} onClick={() => setActiveTab('orderlist')}>
          <i className="bi bi-cart"></i> Đơn hàng
        </Nav.Link>

        <Nav.Link onClick={handleChatClick} className={`ms-3 ${activeTab === 'chat' ? 'active' : ''}`}>
          <FaComments /> Chat
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
