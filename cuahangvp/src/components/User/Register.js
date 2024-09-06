import React, { useState } from 'react';
import styled from 'styled-components';
import apiClient, { endpoints } from '../../configs/API';

const Register = () => {
  const [first_name, setFirstname] = useState('');
  const [last_name, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleRegister = async (event) => {
    event.preventDefault();

    setErrors({});
    setSuccess('');

    const newErrors = {};
    if (!first_name) newErrors.first_name = 'Họ của bạn là gì?';
    if (!last_name) newErrors.last_name = 'Tên của bạn là gì?';
    if (!username) newErrors.username = 'Tên tài khoản là bắt buộc.';
    if (!email) newErrors.email = 'Email của bạn là bắt buộc.';
    if (!password) newErrors.password = 'Nhập mật khẩu là bắt buộc.';
    if (!confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const res = await apiClient.post(endpoints.user, formData);

      if (res.status === 201) { // 201 Created
        setSuccess('Tài khoản đã được tạo thành công.');
        setFirstname('');
        setLastname('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAvatar(null);
      } else {
        // Log the response for debugging
        console.error('Server response:', res);
        setErrors({ server: res.data.detail || 'Đăng ký thất bại.' });
      }
    } catch (error) {
      // Log detailed error for debugging
      console.error('Error during registration:', error.response?.data || error);
      setErrors({ server: error.response?.data?.detail || 'Đăng ký thất bại.' });
    }
  };

  return (
    <Container>
      <Title>Đăng ký tài khoản mới</Title>
      {success && <Alert type="success">{success}</Alert>}
      {errors.server && <Alert type="error">{errors.server}</Alert>}
      <form onSubmit={handleRegister}>
        <FormGroup>
          <label>Họ của bạn là gì?</label>
          <FormControl
            type="text"
            value={first_name}
            onChange={(e) => setFirstname(e.target.value)}
          />
          {errors.first_name && <Error>{errors.first_name}</Error>}
        </FormGroup>
        <FormGroup>
          <label>Tên của bạn là gì?</label>
          <FormControl
            type="text"
            value={last_name}
            onChange={(e) => setLastname(e.target.value)}
          />
          {errors.last_name && <Error>{errors.last_name}</Error>}
        </FormGroup>
        <FormGroup>
          <label>Tên tài khoản</label>
          <FormControl
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <Error>{errors.username}</Error>}
        </FormGroup>
        <FormGroup>
          <label>Email của bạn</label>
          <FormControl
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <Error>{errors.email}</Error>}
        </FormGroup>
        <FormGroup>
          <label>Nhập mật khẩu</label>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <Error>{errors.password}</Error>}
        </FormGroup>
        <FormGroup>
          <label>Xác nhận mật khẩu</label>
          <FormControl
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <Error>{errors.confirmPassword}</Error>}
        </FormGroup>
        <FormGroup>
          <label>Tải ảnh đại diện (không bắt buộc)</label>
          <FormControl
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </FormGroup>
        <Button type="submit">Đăng ký</Button>
      </form>
    </Container>
  );
};

// Phần CSS
const Container = styled.div`
  margin-top: 30px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const FormControl = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  margin-top: 5px;
`;

const Button = styled.button`
  width: 150px; /* Reduced width */
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Alert = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: ${props => (props.type === 'error' ? '#dc3545' : '#28a745')};
`;

const Error = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
`;

export default Register;
