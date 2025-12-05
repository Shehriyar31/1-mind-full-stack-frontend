import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';

function UserDepositHistory() {
  const [depositHistory, setDepositHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userLoggedIn');
    if (!user) {
      navigate('/Users/Login');
    } else {
      loadDepositHistory();
    }
  }, [navigate]);

  const loadDepositHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const response = await fetch('http://localhost:5000/api/deposit-requests');
      const data = await response.json();
      const userDeposits = data.filter(deposit => deposit.userId === user.id);
      setDepositHistory(userDeposits);
    } catch (error) {
      console.error('Failed to load deposit history');
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
                <h2 className="vip-brand-title mb-0">My Deposit History</h2>
                <Button className="vip-submit-btn" onClick={loadDepositHistory}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Account Username</th>
                    <th>Amount</th>
                    <th>Transaction ID</th>
                    <th>Screenshot</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {depositHistory.map(deposit => (
                    <tr key={deposit.id}>
                      <td>{deposit.platform}</td>
                      <td><span className="text-info">{deposit.accountUsername || 'N/A'}</span></td>
                      <td>PKR {deposit.amount}</td>
                      <td>{deposit.transactionId}</td>
                      <td>
                        {deposit.screenshot ? (
                          <span className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Uploaded
                          </span>
                        ) : (
                          <span className="text-muted">No file</span>
                        )}
                      </td>
                      <td>
                        <Badge bg={deposit.status === 'approved' ? 'success' : deposit.status === 'pending' ? 'warning' : 'danger'}>
                          {deposit.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(deposit.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(deposit.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                    </tr>
                  ))}
                  {depositHistory.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">No deposit history found</td>
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

export default UserDepositHistory;