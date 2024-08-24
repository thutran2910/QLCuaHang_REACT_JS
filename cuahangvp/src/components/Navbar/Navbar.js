import React from 'react';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Navbar.css';

const NavbarComponent = ({ searchTerm, setSearchTerm }) => {
  return (
    <Navbar className="navbar-custom navbar-expand-lg bg-dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="text-white">Lavy</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/blog" className="text-white">Blog</Nav.Link>
            <Nav.Link as={Link} to="/login" className="text-white">Đăng nhập</Nav.Link>
            <Nav.Link as={Link} to="/register" className="text-white">Đăng ký</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-white">Giỏ hàng</Nav.Link>
          </Nav>
          <Form className="d-flex ms-auto">
            <FormControl
              type="search"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search"
            />
            <Button variant="outline-light" className="ms-2">Tìm kiếm</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
