import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/1mind.jpg';

function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'shery@0008131') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/Admin/Dashboard');
    } else {
      alert('Invalid admin credentials');
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
                <h2 className="vip-brand-title">ADMIN LOGIN</h2>
                <p className="vip-subtitle">Access Admin Dashboard</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter admin username" 
                    className="vip-input"
                    autoComplete="off"
                    required
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter admin password" 
                    className="vip-input"
                    autoComplete="off"
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  />
                </Form.Group>
                
                <Button type="submit" className="vip-submit-btn w-100 mb-4">
                  <i className="bi bi-shield-lock me-2"></i>
                  ACCESS ADMIN PANEL
                </Button>
                
                <div className="text-center">
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

export default AdminLogin;