import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function ViewAccount() {
  const [userRequests, setUserRequests] = useState([]);
  const [hasInactiveAccounts, setHasInactiveAccounts] = useState(false);
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();



  useEffect(() => {
    const user = localStorage.getItem('userLoggedIn');
    if (!user) {
      navigate('/Users/Login');
    } else {
      loadUserRequests();
    }
  }, [navigate]);

  const loadUserRequests = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const response = await fetch('http://localhost:5000/api/account-requests');
      const data = await response.json();
      const filteredRequests = data.filter(req => req.userId === user.id);
      setUserRequests(filteredRequests);
      
      // Check for inactive accounts
      const inactiveAccounts = filteredRequests.filter(req => 
        req.status === 'approved' && req.accountDetails?.status === 'inactive'
      );
      setHasInactiveAccounts(inactiveAccounts.length > 0);
    } catch (error) {
      console.error('Failed to load requests');
    }
  };

  return (
    <div className="vip-auth-page">
      <UserNavbar />

      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">My Account Requests</h2>
            </div>
          </Col>
        </Row>

        {hasInactiveAccounts && (
          <Row className="mb-4">
            <Col>
              <Alert variant="warning" className="text-center">
                <Alert.Heading>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Account Activation Required
                </Alert.Heading>
                <p className="mb-0">
                  <strong>Make a deposit to activate your account</strong><br/>
                  Some of your accounts are inactive. Please contact admin or make a deposit to activate them.
                </p>
              </Alert>
            </Col>
          </Row>
        )}
        
        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">My Accounts</h4>
                <Button className="vip-submit-btn" onClick={loadUserRequests}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Requested Username</th>
                    <th>Account Username</th>
                    <th>Password</th>
                    <th>Link</th>
                    <th>Account Status</th>
                    <th>Request Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.platform}</td>
                      <td>{request.username}</td>
                      <td>{request.accountDetails?.username || '-'}</td>
                      <td>{request.accountDetails?.password || '-'}</td>
                      <td>
                        {request.accountDetails?.link ? (
                          <a 
                            href={request.accountDetails.link.startsWith('http') ? request.accountDetails.link : `https://${request.accountDetails.link}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-info"
                          >
                            <i className="bi bi-link-45deg"></i> Link
                          </a>
                        ) : '-'}
                      </td>
                      <td>
                        {request.accountDetails?.status ? (
                          <Badge bg={request.accountDetails.status === 'active' ? 'success' : 'danger'}>
                            {request.accountDetails.status === 'active' ? '✓ Active' : '✗ Inactive'}
                          </Badge>
                        ) : '-'}
                      </td>
                      <td>
                        <Badge bg={request.status === 'approved' ? 'success' : request.status === 'pending' ? 'warning' : 'danger'}>
                          {request.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(request.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(request.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                    </tr>
                  ))}
                  {userRequests.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">No requests found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ViewAccount;