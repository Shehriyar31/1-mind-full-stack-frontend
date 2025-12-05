import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function UserWithdraw() {
  const [withdrawData, setWithdrawData] = useState({
    platform: '',
    amount: '',
    method: 'bank',
    bankName: '',
    accountNumber: '',
    accountTitle: ''
  });
  const [userPlatforms, setUserPlatforms] = useState([]);
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    loadUserPlatforms();
  }, []);

  const loadUserPlatforms = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const accountResponse = await fetch('http://localhost:5000/api/account-requests');
      const accounts = await accountResponse.json();
      const userAccounts = accounts.filter(acc => 
        acc.userId === user.id && 
        acc.status === 'approved'
      );
      setUserPlatforms(userAccounts);
    } catch (error) {
      console.error('Failed to load user platforms');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!withdrawData.platform || !withdrawData.amount || !withdrawData.bankName || !withdrawData.accountNumber || !withdrawData.accountTitle) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      
      // Get account username for selected platform
      const accountResponse = await fetch('http://localhost:5000/api/account-requests');
      const accounts = await accountResponse.json();
      const userAccount = accounts.find(acc => 
        acc.userId === user.id && 
        acc.platform === withdrawData.platform && 
        acc.status === 'approved'
      );
      
      const response = await fetch('http://localhost:5000/api/withdraw-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: withdrawData.platform,
          amount: withdrawData.amount,
          bankName: withdrawData.bankName,
          accountNumber: withdrawData.accountNumber,
          accountTitle: withdrawData.accountTitle,
          userId: user.id,
          userFullName: user.fullName,
          accountUsername: userAccount?.accountDetails?.username || 'No Account Found'
        })
      });
      
      if (response.ok) {
        toast.success('Withdraw request submitted successfully!');
        setWithdrawData({ platform: '', amount: '', method: 'bank', bankName: '', accountNumber: '', accountTitle: '' });
      } else {
        toast.error('Failed to submit withdraw request');
      }
    } catch (error) {
      toast.error('Error submitting withdraw request');
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
                <h2 className="vip-brand-title">Withdraw Funds</h2>
                <p className="text-light">Request withdrawal from your account</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Select Platform</Form.Label>
                  <Form.Select 
                    className="vip-input"
                    value={withdrawData.platform}
                    onChange={(e) => setWithdrawData({...withdrawData, platform: e.target.value})}
                    style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
                    required
                  >
                    <option value="" style={{backgroundColor: '#2a2a2a', color: '#fff'}}>Choose Platform</option>
                    {userPlatforms.length > 0 ? (
                      userPlatforms.map(account => (
                        <option 
                          key={account.id} 
                          value={account.platform}
                          style={{backgroundColor: '#2a2a2a', color: '#28a745'}}
                        >
                          🎯 {account.platform}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled style={{backgroundColor: '#2a2a2a', color: '#ff6b6b'}}>
                        No approved accounts found
                      </option>
                    )}
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Withdrawal Amount (PKR)</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter amount to withdraw" 
                    className="vip-input"
                    min="500"
                    required
                    value={withdrawData.amount}
                    onChange={(e) => setWithdrawData({...withdrawData, amount: e.target.value})}
                  />
                  <Form.Text className="text-muted">Minimum withdrawal: PKR 500</Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Withdrawal Method</Form.Label>
                  <Form.Select 
                    className="vip-input"
                    value={withdrawData.method}
                    onChange={(e) => setWithdrawData({...withdrawData, method: e.target.value})}
                    style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
                    required
                  >
                    <option value="bank" style={{backgroundColor: '#2a2a2a', color: '#28a745'}}>
                      Bank Transfer
                    </option>
                  </Form.Select>
                </Form.Group>
                
                {withdrawData.method === 'bank' && (
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="vip-label">Bank Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter bank name" 
                        className="vip-input"
                        required
                        value={withdrawData.bankName}
                        onChange={(e) => setWithdrawData({...withdrawData, bankName: e.target.value})}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="vip-label">Account Number</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter account number (numbers only)" 
                        className="vip-input"
                        required
                        value={withdrawData.accountNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setWithdrawData({...withdrawData, accountNumber: value});
                        }}
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="vip-label">Account Title</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter account title" 
                        className="vip-input"
                        required
                        value={withdrawData.accountTitle}
                        onChange={(e) => setWithdrawData({...withdrawData, accountTitle: e.target.value})}
                      />
                    </Form.Group>
                  </>
                )}
                
                <div className="text-center mb-4">
                  <Button type="submit" className="vip-submit-btn px-5 py-3">
                    <i className="bi bi-dash-circle me-2"></i>
                    Submit Withdrawal Request
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
    </div>
  );
}

export default UserWithdraw;