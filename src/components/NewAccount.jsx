import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function NewAccount() {
  const [formData, setFormData] = useState({
    accountType: 'cricket-betting',
    platform: '',
    username: '',
    password: ''
  });
  const [exchanges, setExchanges] = useState([]);
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/exchanges');
      const data = await response.json();
      setExchanges(data);
    } catch (error) {
      console.error('Failed to load exchanges');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.platform) {
      toast.error('Please select a platform first');
      return;
    }
    if (!formData.username) {
      toast.error('Please enter a username');
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const response = await fetch('http://localhost:5000/api/account-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: formData.platform,
          username: formData.username,
          userId: user.id,
          userFullName: user.fullName
        })
      });
      
      if (response.ok) {
        toast.success('Your request has been submitted');
        setFormData({ accountType: 'cricket-betting', platform: '', username: '', password: '' });
      } else {
        toast.error('Failed to submit request');
      }
    } catch (error) {
      toast.error('Error submitting request');
    }
  };

  return (
    <div className="vip-auth-page">
      <UserNavbar />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="vip-auth-card">
              <div className="text-center mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="vip-brand-title mb-0">Account Request Form</h2>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={loadExchanges}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                  </Button>
                </div>
                <p className="text-light">Submit your gaming account requirements</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="vip-label">Platform/Site</Form.Label>
                      <Form.Select 
                        className="vip-input"
                        value={formData.platform}
                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                        style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
                        required
                      >
                        <option value="" style={{backgroundColor: '#2a2a2a', color: '#fff'}}>Select Platform</option>
                        {exchanges.map(exchange => {
                          const getExchangeIcon = (name) => {
                            const lowerName = name.toLowerCase();
                            if (lowerName.includes('bet365')) return '🎯';
                            if (lowerName.includes('betway')) return '🏆';
                            if (lowerName.includes('1xbet')) return '⭐';
                            if (lowerName.includes('dafabet')) return '🔥';
                            if (lowerName.includes('betfair')) return '💎';
                            if (lowerName.includes('bp')) return '🏏';
                            if (lowerName.includes('lg')) return '🏆';
                            if (lowerName.includes('asia')) return '🌏';
                            // Auto generate icon from first 2 letters
                            const firstTwo = name.substring(0, 2).toUpperCase();
                            return `🎲${firstTwo}`;
                          };
                          
                          return (
                            <option 
                              key={exchange.id} 
                              value={exchange.name}
                              style={{backgroundColor: '#2a2a2a', color: '#28a745'}}
                            >
                              {getExchangeIcon(exchange.name)} {exchange.name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                {formData.platform && (
                  <Form.Group className="mb-4">
                    <Form.Label className="vip-label">Preferred Username</Form.Label>
                    <Form.Control 
                      type="text"
                      placeholder="Enter your preferred username"
                      className="vip-input"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </Form.Group>
                )}
                
                <div className="text-center mb-4">
                  <Button type="submit" className="vip-submit-btn px-5 py-3">
                    <i className="bi bi-send me-2"></i>
                    Submit Request
                  </Button>
                </div>
                
                <div className="text-center">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Our team will contact you within the selected timeframe
                  </small>
                </div>
                
                <div className="text-center">
                  <Button variant="outline-light" onClick={() => navigate('/User/Dashboard')}>
                    <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NewAccount;