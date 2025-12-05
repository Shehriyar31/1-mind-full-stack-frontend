import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

function WithdrawRequests() {
  const [withdrawals, setWithdrawals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/Users/Login');
    } else {
      loadWithdrawals();
    }
  }, [navigate]);

  const loadWithdrawals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/withdraw-requests');
      const data = await response.json();
      setWithdrawals(data);
    } catch (error) {
      toast.error('Failed to load withdrawals');
    }
  };

  const updateWithdrawalStatus = async (withdrawalId, status) => {
    try {
      await fetch(`http://localhost:5000/api/withdraw-requests/${withdrawalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (status === 'rejected') {
        toast.success('Withdrawal rejected and deleted successfully');
      } else {
        toast.success(`Withdrawal ${status} successfully`);
      }
      
      loadWithdrawals();
    } catch (error) {
      toast.error('Failed to update withdrawal status');
    }
  };

  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">Withdraw Requests</h2>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">All Withdraw Requests</h4>
                <Button className="vip-submit-btn" onClick={loadWithdrawals}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Platform</th>
                    <th>Account Username</th>
                    <th>Amount</th>
                    <th>Bank Details</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map(withdrawal => (
                    <tr key={withdrawal.id}>
                      <td>{withdrawal.userFullName}</td>
                      <td>{withdrawal.platform}</td>
                      <td><span className="text-info">{withdrawal.accountUsername}</span></td>
                      <td>PKR {withdrawal.amount}</td>
                      <td>
                        <small>
                          {withdrawal.bankName}<br/>
                          {withdrawal.accountNumber}
                        </small>
                      </td>
                      <td>
                        <Badge bg={
                          withdrawal.status === 'approved' ? 'success' : 
                          withdrawal.status === 'pending' ? 'warning' : 'danger'
                        }>
                          {withdrawal.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(withdrawal.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(withdrawal.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                      <td>
                        {withdrawal.status === 'pending' && (
                          <>
                            <Button 
                              variant="success" 
                              size="sm"
                              className="me-2"
                              onClick={() => updateWithdrawalStatus(withdrawal.id, 'approved')}
                            >
                              <i className="bi bi-check"></i>
                            </Button>
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => updateWithdrawalStatus(withdrawal.id, 'rejected')}
                            >
                              <i className="bi bi-x"></i>
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">No withdraw requests found</td>
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

export default WithdrawRequests;