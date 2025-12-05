import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/1mind.jpg';

function Register() {
  const generateRegNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const [formData, setFormData] = useState({
    regNumber: generateRegNumber(),
    fullName: '',
    username: '',
    whatsapp: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    // Validate WhatsApp number
    if (!/^03[0-9]{9}$/.test(formData.whatsapp)) {
      toast.error('WhatsApp number must start with 03 and be 11 digits long');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regNumber: formData.regNumber,
          fullName: formData.fullName,
          username: formData.username,
          whatsapp: formData.whatsapp,
          password: formData.password
        })
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('userLoggedIn', JSON.stringify(userData.user));
        toast.success('Account created successfully!');
        navigate('/User/Dashboard');
      } else {
        const error = await response.json();
        if (error.message.includes('username')) {
          toast.error('Username already exists');
        } else if (error.message.includes('whatsapp')) {
          toast.error('WhatsApp number already registered');
        } else {
          toast.error(error.message || 'Registration failed');
        }
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="vip-auth-page">
      <Container className="py-5">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={8} lg={6}>
            <div className="vip-auth-card">
              <div className="text-center mb-4">
                <img src={logo} alt="1MindExch" className="vip-logo mb-3" />
                <h2 className="vip-brand-title">1MINDEXCH</h2>
                <p className="vip-subtitle">Join the Elite Gaming Community</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Registration ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    className="vip-input"
                    value={formData.regNumber}
                    disabled
                    style={{backgroundColor: '#2a2a2a', color: '#fff', cursor: 'not-allowed'}}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Full Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="vip-input"
                    autoComplete="off"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Choose a username" 
                    className="vip-input"
                    autoComplete="off"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">WhatsApp Number</Form.Label>
                  <Form.Control 
                    type="tel" 
                    placeholder="03XXXXXXXXX (11 digits)" 
                    className="vip-input"
                    autoComplete="off"
                    required
                    pattern="^03[0-9]{9}$"
                    maxLength="11"
                    title="WhatsApp number must start with 03 and be 11 digits long"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="vip-label">Password</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type={showPassword ? "text" : "password"}
                          placeholder="Create password (min 6 characters)" 
                          className="vip-input"
                          autoComplete="off"
                          required
                          minLength="6"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="vip-label">Confirm Password</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password" 
                          className="vip-input"
                          autoComplete="off"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                        <Button 
                          variant="outline-secondary"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button type="submit" className="vip-submit-btn w-100 mb-4">
                  <i className="bi bi-person-plus me-2"></i>
                  CREATE VIP ACCOUNT
                </Button>
                
                <div className="text-center">
                  <p className="vip-link-text">
                    Already have an account? 
                    <Link to="/Users/Login" className="vip-link"> Login Here</Link>
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

export default Register;