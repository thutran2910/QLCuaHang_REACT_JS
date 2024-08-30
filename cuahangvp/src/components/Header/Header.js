import React, { useEffect, useState } from 'react';
import { Carousel, Container, Dropdown, Form, Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import apiClient, { endpoints } from '../../configs/API';

const Header = () => {
    const [categories, setCategories] = useState([]);
    const images = [
        'https://via.placeholder.com/1200x400?text=Slide+1',
        'https://via.placeholder.com/1200x400?text=Slide+2',
        'https://via.placeholder.com/1200x400?text=Slide+3',
    ];

    useEffect(() => {
        // Fetch categories from the API using axios
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
                                <React.Fragment key={category.id}>
                                    <Dropdown.Item href={`#${category.name}`}>
                                        {category.name}
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                </React.Fragment>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form className="d-flex ms-3">
                        <Form.Control
                            type="search"
                            placeholder="Tìm kiếm"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Tìm kiếm</Button>
                    </Form>

                    <Nav.Link href="#news" className="ms-3">
                        Báo điện tử
                    </Nav.Link>
                    <Nav.Link href="#cart" className="ms-3">
                        <i className="bi bi-cart"></i> Giỏ hàng
                    </Nav.Link>
                    <Dropdown className="ms-3">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Tài khoản
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#action/3.1">Đăng nhập</Dropdown.Item>
                            <Dropdown.Item href="#action/3.2">Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </nav>
        </header>
    );
};

export default Header;
