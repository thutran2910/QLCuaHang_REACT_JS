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
      setError('Vui lòng nhập lại email hoặc password');
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.containerLogin}>
        <h1 style={styles.title}>ĐĂNG NHẬP</h1>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="username"
              placeholder="Username..."
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
              {secureTextEntry ? 'Show' : 'Hide'}
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
      </div>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  background: {
    background: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerLogin: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
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
    border: 'none',
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
};

export default Login;