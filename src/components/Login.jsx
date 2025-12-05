import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/1mind.jpg';
import config from '../config';

function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (userLoggedIn) {
      navigate('/User/Dashboard', { replace: true });
    } else if (adminLoggedIn) {
      navigate('/Admin/Dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Admin login
    if (credentials.username === 'admin' && credentials.password === 'shery@0008131') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/Admin/Dashboard');
      return;
    }
    
    // User login
    try {
      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userLoggedIn', JSON.stringify(userData.user));
        toast.success('Login successful!');
        navigate('/User/Dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  return (
    <div className="vip-auth-page">
      <Container className="py-5">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={5}>
            <div className="vip-auth-card">
              <div className="text-center mb-4">
                <img src={logo} alt="1MindExch" className="vip-logo mb-3" />
                <h2 className="vip-brand-title">1MINDEXCH</h2>
                <p className="vip-subtitle">Welcome Back to Premium Gaming</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Username or WhatsApp Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your username or WhatsApp number" 
                    className="vip-input"
                    autoComplete="off"
                    required
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Password</Form.Label>
                  <InputGroup>
                    <Form.Control 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" 
                      className="vip-input"
                      autoComplete="off"
                      required
                      value={credentials.password}
                      onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                    <Button 
                      variant="outline-secondary"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>
                
                <Button type="submit" className="vip-submit-btn w-100 mb-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  LOGIN TO ACCOUNT
                </Button>
                
                <div className="text-center">
                  <p className="vip-link-text">
                    Don't have an account? 
                    <Link to="/Users/Register" className="vip-link"> Create Account</Link>
                  </p>
                  <Link to="/" className="vip-back-link">
                    <i className="bi bi-arrow-left me-2"></i>Back to Home
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;