import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import DashboardFooter from './DashboardFooter';
import useAutoLogout from '../utils/useAutoLogout';

function UserDashboard() {
  const [userInfo, setUserInfo] = useState({});
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    const user = localStorage.getItem('userLoggedIn');
    if (!user) {
      navigate('/Users/Login');
    } else {
      setUserInfo(JSON.parse(user));
      loadUserData();
      
      // Check user status every second
      const statusInterval = setInterval(checkUserStatus, 1000);
      return () => clearInterval(statusInterval);
    }
  }, [navigate]);

  const checkUserStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      if (!user) return;
      
      const userId = user.id || user._id;
      if (!userId) return;
      
      const response = await fetch(`http://localhost:5000/api/auth/user-status/${userId}`);
      const data = await response.json();
      
      if (!data.exists || !data.isActive) {
        localStorage.removeItem('userLoggedIn');
        toast.error('Your account has been deactivated. Please contact admin.');
        navigate('/Users/Login');
      }
    } catch (error) {
      console.error('Status check failed');
    }
  };

  const loadUserData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const userId = user?.id || user?._id;
      
      if (!userId) {
        console.error('No user ID found');
        return;
      }
      
      // Set default values for now
      setBalance(0);
      setRecentTransactions([]);
    } catch (error) {
      console.error('Failed to load user data');
    }
  };



  return (
    <div className="vip-auth-page">
      <UserNavbar />
      
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-2">Welcome, {userInfo.fullName}</h2>
              <p className="text-light">Registration Number: <span className="text-success fw-bold">{userInfo.regNumber || userInfo.id || 'N/A'}</span></p>
            </div>
          </Col>
        </Row>



        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h4 className="text-light mb-4">Quick Actions</h4>
              <Row>
                <Col md={6}>
                  <Button className="vip-submit-btn w-100 mb-3" onClick={() => navigate('/User/New/Account')}>
                    <i className="bi bi-person-plus me-2"></i>Create New Account
                  </Button>
                </Col>
                <Col md={6}>
                  <Button className="vip-submit-btn w-100 mb-3" onClick={() => navigate('/User/View/Account')}>
                    <i className="bi bi-eye me-2"></i>View My Accounts
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
      <DashboardFooter />
    </div>
  );
}

export default UserDashboard;