import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { authApi, setAuthToken, endpoints } from '../../configs/API';
import { MyDispatchContext } from '../../configs/Contexts';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useContext(MyDispatchContext);

  const login = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('client_id', 'mGQ0J4W8NGTMtSoQkSSgwKKEWpOGb1FWbzbNNeMu');
      formData.append('client_secret', 'We7fU2Hub7g76S0zIp35s5GguG7PqpnXbrTtARU3vHfqC68WrbHIt4R5KUj2v2CzVCWABfK8OKnicQXqFgZEUnt80wCb2xvLKkaObMtbNVn00ia3WybcIMTMAt3J7ApG');
      formData.append('grant_type', 'password');

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const res = await authApi().post(endpoints.login, formData, config);
      const token = res.data.access_token;
      console.log('Login successful, token:', token);
      setAuthToken(token);

      const userRes = await authApi().get(endpoints.currentUser);
      const user = userRes.data;

      console.info(user);

      dispatch({
        type: 'login',
        payload: user,
      });

      navigate('/');
    } catch (ex) {
      console.error('Login error', ex);
      setError('Vui lòng nhập lại tên đăng nhập hoặc mật khẩu');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.containerLogin}>
        <h1 style={styles.title}>ĐĂNG NHẬP</h1>
        <p style={styles.welcomeMessage}>Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.</p>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="username"
              placeholder="Tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              autoComplete="username"
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" style={styles.positionRelative}>
            <Form.Control
              type={secureTextEntry ? 'password' : 'text'}
              placeholder="Mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              autoComplete="current-password"
            />
            <Button
              variant="link"
              style={styles.passwordToggle}
              onClick={() => setSecureTextEntry(!secureTextEntry)}
            >
              {/* Có thể thêm biểu tượng hiển thị mật khẩu */}
            </Button>
          </Form.Group>
          {error && (
            <Alert variant="danger" style={styles.alert}>
              {error}
            </Alert>
          )}
          <Button variant="success" onClick={login} style={styles.loginBtn}>
            ĐĂNG NHẬP
          </Button>
        </Form>
        <p style={styles.registerLink}>
          Chưa có tài khoản? <a href="/register">Đăng ký tại đây</a>
        </p>
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  background: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'url("https://toigingiuvedep.vn/wp-content/uploads/2021/08/nhung-background-book-background-sach-dep-day-an-tuong.jpg")', // Thêm ảnh nền
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  containerLogin: {
    background: 'rgba(255, 255, 255, 0.9)', // Thêm độ trong suốt để nhìn thấy ảnh nền
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '100%',
    maxWidth: '400px',
    position: 'relative', // Để cho nút có thể được định vị bên trong
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  welcomeMessage: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#555',
  },
  input: {
    marginBottom: '15px',
  },
  positionRelative: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    background: 'transparent',
    cursor: 'pointer',
  },
  loginBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
  },
  alert: {
    marginTop: '10px',
  },
  registerLink: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#007bff',
  },
};

export default Login;
