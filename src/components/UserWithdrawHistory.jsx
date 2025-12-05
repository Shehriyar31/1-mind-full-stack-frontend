import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';

function UserWithdrawHistory() {
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userLoggedIn');
    if (!user) {
      navigate('/Users/Login');
    } else {
      loadWithdrawHistory();
    }
  }, [navigate]);

  const loadWithdrawHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const response = await fetch('http://localhost:5000/api/withdraw-requests');
      const data = await response.json();
      const userWithdraws = data.filter(withdraw => withdraw.userId === user.id);
      setWithdrawHistory(userWithdraws);
    } catch (error) {
      console.error('Failed to load withdraw history');
    }
  };



  return (
    <div className="vip-auth-page">
      <UserNavbar />

      <Container className="py-5">
        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="vip-brand-title mb-0">My Withdraw History</h2>
                <Button className="vip-submit-btn" onClick={loadWithdrawHistory}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Account Username</th>
                    <th>Amount</th>
                    <th>Bank Details</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawHistory.map(withdraw => (
                    <tr key={withdraw.id}>
                      <td>{withdraw.platform}</td>
                      <td><span className="text-info">{withdraw.accountUsername || 'N/A'}</span></td>
                      <td>PKR {withdraw.amount}</td>
                      <td>
                        <small>
                          <strong>{withdraw.bankName}</strong><br/>
                          {withdraw.accountNumber}<br/>
                          {withdraw.accountTitle}
                        </small>
                      </td>
                      <td>
                        <Badge bg={withdraw.status === 'approved' ? 'success' : withdraw.status === 'pending' ? 'warning' : 'danger'}>
                          {withdraw.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(withdraw.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(withdraw.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                    </tr>
                  ))}
                  {withdrawHistory.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">No withdraw history found</td>
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

export default UserWithdrawHistory;