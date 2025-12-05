import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserNavbar from './UserNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function UserDeposit() {
  const [depositData, setDepositData] = useState({
    platform: '',
    amount: '',
    method: '',
    transactionId: '',
    screenshot: null
  });
  const [minDeposit, setMinDeposit] = useState(500);
  const [userPlatforms, setUserPlatforms] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();

  useEffect(() => {
    loadMinDeposit();
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bank-accounts');
      const data = await response.json();
      setBankAccounts(data);
    } catch (error) {
      console.error('Failed to load bank accounts');
    }
  };

  const loadMinDeposit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      const [accountResponse, exchangeResponse] = await Promise.all([
        fetch('http://localhost:5000/api/account-requests'),
        fetch('http://localhost:5000/api/exchanges')
      ]);
      
      const accounts = await accountResponse.json();
      const exchanges = await exchangeResponse.json();
      
      console.log('User ID:', user.id);
      console.log('All accounts:', accounts);
      console.log('All exchanges:', exchanges);
      
      // Show approved accounts regardless of active/inactive status
      const userAccounts = accounts.filter(acc => 
        acc.userId === user.id && 
        acc.status === 'approved'
      );
      
      console.log('User approved accounts:', userAccounts);
      
      // Filter user accounts to only include platforms that still exist in exchanges
      const validUserAccounts = userAccounts.filter(acc => 
        exchanges.some(ex => ex.name === acc.platform)
      );
      
      console.log('Valid user accounts:', validUserAccounts);
      setUserPlatforms(validUserAccounts);
      
      if (validUserAccounts.length > 0) {
        const userExchange = exchanges.find(ex => ex.name === validUserAccounts[0].platform);
        if (userExchange && userExchange.minDeposit) {
          setMinDeposit(parseInt(userExchange.minDeposit));
        }
      }
    } catch (error) {
      console.error('Failed to load minimum deposit:', error);
    }
  };

  const handlePlatformChange = async (platformName) => {
    setDepositData({...depositData, platform: platformName});
    
    try {
      const exchangeResponse = await fetch('http://localhost:5000/api/exchanges');
      const exchanges = await exchangeResponse.json();
      const selectedExchange = exchanges.find(ex => ex.name === platformName);
      
      if (selectedExchange && selectedExchange.minDeposit) {
        setMinDeposit(parseInt(selectedExchange.minDeposit));
      }
    } catch (error) {
      console.error('Failed to load minimum deposit for platform');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!depositData.platform || !depositData.amount || !depositData.method || !depositData.transactionId || !depositData.screenshot || !depositData.screenshot.data) {
      toast.error('Please fill all required fields including payment screenshot');
      return;
    }
    
    try {
      const user = JSON.parse(localStorage.getItem('userLoggedIn'));
      
      // Get account username for selected platform
      const accountResponse = await fetch('http://localhost:5000/api/account-requests');
      const accounts = await accountResponse.json();
      
      console.log('User ID:', user.id);
      console.log('Selected Platform:', depositData.platform);
      console.log('All accounts:', accounts);
      
      const userAccount = accounts.find(acc => {
        console.log('Checking account:', acc);
        console.log('userId match:', acc.userId, '===', user.id, ':', acc.userId === user.id);
        console.log('platform match:', acc.platform, '===', depositData.platform, ':', acc.platform === depositData.platform);
        console.log('status match:', acc.status, '===', 'approved', ':', acc.status === 'approved');
        return acc.userId === user.id && 
               acc.platform === depositData.platform && 
               acc.status === 'approved';
      });
      
      console.log('Found user account:', userAccount);
      console.log('Account username will be:', userAccount?.accountDetails?.username);
      console.log('Screenshot data size:', depositData.screenshot?.data?.length);
      
      const response = await fetch('http://localhost:5000/api/deposit-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: depositData.platform,
          amount: depositData.amount,
          method: depositData.method,
          transactionId: depositData.transactionId,
          userId: user.id,
          userFullName: user.fullName,
          accountUsername: userAccount?.accountDetails?.username || 'No Account Found',
          screenshot: depositData.screenshot ? depositData.screenshot.name : null,
          screenshotData: depositData.screenshot?.data || null
        })
      });
      
      if (response.ok) {
        toast.success('Deposit request submitted successfully!');
        setDepositData({ platform: '', amount: '', method: '', transactionId: '', screenshot: null });
      } else {
        toast.error('Failed to submit deposit request');
      }
    } catch (error) {
      toast.error('Error submitting deposit request');
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
                  <h2 className="vip-brand-title mb-0">Make Deposit</h2>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => {loadMinDeposit(); loadBankAccounts();}}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                  </Button>
                </div>
                <p className="text-light">Add funds to your account</p>
              </div>
              
              <Form className="vip-form" onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Select Platform</Form.Label>
                  <Form.Select 
                    className="vip-input"
                    value={depositData.platform}
                    onChange={(e) => handlePlatformChange(e.target.value)}
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
                  <Form.Label className="vip-label">Deposit Amount (PKR)</Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter amount" 
                    className="vip-input"
                    min={minDeposit}
                    required
                    value={depositData.amount}
                    onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                  />
                  <Form.Text className="text-muted">Minimum deposit: PKR {minDeposit}</Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Select Bank Account</Form.Label>
                  <Form.Select 
                    className="vip-input"
                    value={depositData.method}
                    onChange={(e) => setDepositData({...depositData, method: e.target.value})}
                    style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
                    required
                  >
                    <option value="" style={{backgroundColor: '#2a2a2a', color: '#fff'}}>Choose Bank Account</option>
                    {bankAccounts.map(account => (
                      <option 
                        key={account.id} 
                        value={account.id}
                        style={{backgroundColor: '#2a2a2a', color: '#28a745'}}
                      >
                        {account.bankName} - {account.accountNumber}
                      </option>
                    ))}
                  </Form.Select>
                  {depositData.method && (() => {
                    const selectedAccount = bankAccounts.find(acc => acc.id === depositData.method);
                    return selectedAccount ? (
                      <div className="mt-2 p-2" style={{backgroundColor: '#2a2a2a', borderRadius: '5px'}}>
                        <div className="text-light">
                          <strong>Account Details:</strong><br/>
                          Bank: {selectedAccount.bankName}<br/>
                          Account: {selectedAccount.accountNumber}<br/>
                          Title: {selectedAccount.accountTitle}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Transaction ID</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter transaction/reference ID" 
                    className="vip-input"
                    required
                    value={depositData.transactionId}
                    onChange={(e) => setDepositData({...depositData, transactionId: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="vip-label">Payment Screenshot</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="image/*"
                    className="vip-input"
                    style={{
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '12px 15px'
                    }}
                    required
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Check file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('Image size must be less than 5MB');
                          return;
                        }
                        
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          // Compress image if needed
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            
                            // Set max dimensions
                            const maxWidth = 800;
                            const maxHeight = 600;
                            let { width, height } = img;
                            
                            // Calculate new dimensions
                            if (width > height) {
                              if (width > maxWidth) {
                                height = (height * maxWidth) / width;
                                width = maxWidth;
                              }
                            } else {
                              if (height > maxHeight) {
                                width = (width * maxHeight) / height;
                                height = maxHeight;
                              }
                            }
                            
                            canvas.width = width;
                            canvas.height = height;
                            
                            // Draw and compress
                            ctx.drawImage(img, 0, 0, width, height);
                            const compressedData = canvas.toDataURL('image/jpeg', 0.7);
                            
                            setDepositData({
                              ...depositData, 
                              screenshot: {
                                name: file.name,
                                data: compressedData
                              }
                            });
                          };
                          img.src = event.target.result;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {depositData.screenshot && (
                    <div className="mt-2 text-success">
                      <i className="bi bi-check-circle me-2"></i>
                      Selected: {depositData.screenshot.name}
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    Upload payment screenshot (JPG, PNG, etc.)
                  </Form.Text>
                </Form.Group>
                
                <div className="text-center mb-4">
                  <Button type="submit" className="vip-submit-btn px-5 py-3">
                    <i className="bi bi-plus-circle me-2"></i>
                    Submit Deposit Request
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

export default UserDeposit;