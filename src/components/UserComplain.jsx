import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import useAutoLogout from '../utils/useAutoLogout';
import DashboardFooter from './DashboardFooter';

function UserComplain() {
  const [complainData, setComplainData] = useState({
    accountUsername: '',
    message: ''
  });
  const navigate = useNavigate();
  
  useAutoLogout();



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const response = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountUsername: complainData.accountUsername,
          message: complainData.message,
          userId: user.id,
          userFullName: user.fullName
        })
      });
      
      if (response.ok) {
        toast.success('Complaint submitted successfully!');
        setComplainData({ accountUsername: '', message: '' });
      } else {
        toast.error('Failed to submit complaint');
      }
    } catch (error) {
      toast.error('Error submitting complaint');
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
                <h2 className="vip-brand-title">Submit Complaint</h2>
                <p className="text-light">Let us know about your concerns</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Account Username</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Enter your account username"
                    className="vip-input"
                    value={complainData.accountUsername}
                    onChange={(e) => setComplainData({...complainData, accountUsername: e.target.value})}
                    required
                  />
                </Form.Group>
                

                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Message</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={5}
                    placeholder="Describe your complaint in detail..."
                    className="vip-input"
                    value={complainData.message}
                    onChange={(e) => setComplainData({...complainData, message: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <div className="text-center mb-4">
                  <Button type="submit" className="vip-submit-btn px-5 py-3">
                    <i className="bi bi-send me-2"></i>
                    Submit Complaint
                  </Button>
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
      <DashboardFooter />
    </div>
  );
}

export default UserComplain;