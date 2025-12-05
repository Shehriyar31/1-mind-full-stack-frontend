import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import DashboardFooter from './DashboardFooter';
import useAutoLogout from '../utils/useAutoLogout';

function AdminDashboard() {
  const [userStats, setUserStats] = useState({ 
    totalUsers: 0, 
    activeUsers: 0, 
    inactiveUsers: 0, 
    pendingUsers: 0 
  });
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/Users/Login');
    } else {
      loadUserStats();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadUserStats, 30000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  const loadUserStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users');
      const users = await response.json();
      
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.isActive).length;
      const inactiveUsers = users.filter(user => !user.isActive).length;
      const pendingUsers = users.filter(user => user.status === 'pending').length;
      
      setUserStats({ totalUsers, activeUsers, inactiveUsers, pendingUsers });
    } catch (error) {
      console.error('Failed to load user stats');
    }
  };



  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">Admin Dashboard</h2>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={3} className="mb-4">
            <Card className="vip-auth-card text-center h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-people fs-1 text-primary mb-3"></i>
                <h2 className="text-light mb-2">{userStats.totalUsers}</h2>
                <p className="text-light mb-0">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="vip-auth-card text-center h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-person-check fs-1 text-success mb-3"></i>
                <h2 className="text-light mb-2">{userStats.activeUsers}</h2>
                <p className="text-light mb-0">Active Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="vip-auth-card text-center h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-person-x fs-1 text-danger mb-3"></i>
                <h2 className="text-light mb-2">{userStats.inactiveUsers}</h2>
                <p className="text-light mb-0">Inactive Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card className="vip-auth-card text-center h-100">
              <Card.Body className="d-flex flex-column justify-content-center">
                <i className="bi bi-clock fs-1 text-warning mb-3"></i>
                <h2 className="text-light mb-2">{userStats.pendingUsers}</h2>
                <p className="text-light mb-0">Pending Users</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        <Row className="justify-content-center mt-4">
          <Col md={6} className="text-center">
            <Button className="vip-submit-btn me-3" onClick={loadUserStats}>
              <i className="bi bi-arrow-clockwise me-2"></i>Refresh Now
            </Button>
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              Auto-refreshes every 30 seconds
            </small>
          </Col>
        </Row>
      </Container>
      <DashboardFooter />
    </div>
  );
}

export default AdminDashboard;