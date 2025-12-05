import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

function DepositRequests() {
  const [deposits, setDeposits] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/Users/Login');
    } else {
      loadDeposits();
      loadBankAccounts();
    }
  }, [navigate]);

  const loadDeposits = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/deposit-requests');
      const data = await response.json();
      setDeposits(data);
    } catch (error) {
      toast.error('Failed to load deposits');
    }
  };

  const loadBankAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bank-accounts');
      const data = await response.json();
      setBankAccounts(data);
    } catch (error) {
      console.error('Failed to load bank accounts');
    }
  };

  const updateDepositStatus = async (depositId, status) => {
    try {
      await fetch(`http://localhost:5000/api/deposit-requests/${depositId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (status === 'rejected') {
        toast.success('Deposit rejected and deleted successfully');
      } else {
        toast.success(`Deposit ${status} successfully`);
      }
      
      loadDeposits();
    } catch (error) {
      toast.error('Failed to update deposit status');
    }
  };

  const deleteDeposit = async (depositId) => {
    if (window.confirm('Are you sure you want to delete this deposit request?')) {
      try {
        await fetch(`http://localhost:5000/api/deposit-requests/${depositId}`, {
          method: 'DELETE'
        });
        toast.success('Deposit request deleted successfully');
        loadDeposits();
      } catch (error) {
        toast.error('Failed to delete deposit request');
      }
    }
  };

  const viewDetails = (deposit) => {
    setSelectedDeposit(deposit);
    setShowModal(true);
  };

  const getBankAccountDetails = (methodId) => {
    return bankAccounts.find(acc => acc.id === methodId);
  };

  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">Deposit Requests</h2>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">All Deposit Requests</h4>
                <Button className="vip-submit-btn" onClick={loadDeposits}>
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
                    <th>Transaction ID</th>
                    <th>Screenshot</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map(deposit => (
                    <tr key={deposit.id}>
                      <td>{deposit.userFullName}</td>
                      <td>{deposit.platform}</td>
                      <td><span className="text-info">{deposit.accountUsername || 'N/A'}</span></td>
                      <td>PKR {deposit.amount}</td>
                      <td>{deposit.transactionId}</td>
                      <td>
                        {deposit.screenshot ? (
                          <span className="text-success">
                            <i className="bi bi-image me-1"></i>
                            {deposit.screenshot}
                          </span>
                        ) : (
                          <span className="text-muted">No file</span>
                        )}
                      </td>
                      <td>
                        <Badge bg={
                          deposit.status === 'approved' ? 'success' : 
                          deposit.status === 'pending' ? 'warning' : 'danger'
                        }>
                          {deposit.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(deposit.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(deposit.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                      <td>
                        <Button 
                          variant="info" 
                          size="sm"
                          className="me-2"
                          onClick={() => viewDetails(deposit)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          className="me-2"
                          onClick={() => deleteDeposit(deposit.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                        {deposit.status === 'pending' && (
                          <>
                            <Button 
                              variant="success" 
                              size="sm"
                              className="me-2"
                              onClick={() => updateDepositStatus(deposit.id, 'approved')}
                            >
                              <i className="bi bi-check"></i>
                            </Button>
                            <Button 
                              variant="warning" 
                              size="sm"
                              onClick={() => updateDepositStatus(deposit.id, 'rejected')}
                            >
                              <i className="bi bi-x"></i>
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {deposits.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center text-muted">No deposit requests found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{backgroundColor: '#2a2a2a', borderColor: '#444'}}>
          <Modal.Title className="text-light">Deposit Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{backgroundColor: '#2a2a2a', color: '#fff'}}>
          {selectedDeposit && (
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <strong>User Information:</strong>
                  <div className="mt-2">
                    <div><strong>Full Name:</strong> {selectedDeposit.userFullName}</div>
                    <div><strong>Account Username:</strong> <span className="text-info">{selectedDeposit.accountUsername || 'N/A'}</span></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Platform Details:</strong>
                  <div className="mt-2">
                    <div><strong>Exchange:</strong> {selectedDeposit.platform}</div>
                    <div><strong>Amount:</strong> <span className="text-success">PKR {selectedDeposit.amount}</span></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Transaction Details:</strong>
                  <div className="mt-2">
                    <div><strong>Transaction ID:</strong> {selectedDeposit.transactionId}</div>
                    <div><strong>Status:</strong> 
                      <Badge bg={selectedDeposit.status === 'approved' ? 'success' : selectedDeposit.status === 'pending' ? 'warning' : 'danger'} className="ms-2">
                        {selectedDeposit.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <div className="mb-3">
                  <strong>Payment Method:</strong>
                  <div className="mt-2">
                    {(() => {
                      const bankAccount = getBankAccountDetails(selectedDeposit.method);
                      return bankAccount ? (
                        <div className="p-2" style={{backgroundColor: '#1a1a1a', borderRadius: '5px'}}>
                          <div><strong>Bank:</strong> {bankAccount.bankName}</div>
                          <div><strong>Account Number:</strong> {bankAccount.accountNumber}</div>
                          <div><strong>Account Title:</strong> {bankAccount.accountTitle}</div>
                        </div>
                      ) : (
                        <span className="text-muted">Bank details not found</span>
                      );
                    })()} 
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Screenshot:</strong>
                  <div className="mt-2">
                    {selectedDeposit.screenshot ? (
                      <div className="p-3" style={{backgroundColor: '#1a1a1a', borderRadius: '8px', border: '2px dashed #28a745'}}>
                        {selectedDeposit.screenshotData ? (
                          <div className="text-center">
                            <img 
                              src={selectedDeposit.screenshotData} 
                              alt="Payment Screenshot" 
                              style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '5px'}}
                              className="mb-2"
                            />
                            <div className="text-success">
                              <strong>Payment Screenshot</strong>
                            </div>
                            <div className="text-light">
                              <small>Filename: {selectedDeposit.screenshot}</small>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <i className="bi bi-image fs-1 text-warning mb-2 d-block"></i>
                            <div className="text-warning mb-2">
                              <strong>Screenshot File Uploaded</strong>
                            </div>
                            <div className="text-light mb-2">
                              <small>Filename: {selectedDeposit.screenshot}</small>
                            </div>
                            <div className="text-muted">
                              <small><i className="bi bi-info-circle me-1"></i>Image preview not available for this request</small>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3" style={{backgroundColor: '#1a1a1a', borderRadius: '8px', border: '2px dashed #dc3545'}}>
                        <div className="text-center text-danger">
                          <i className="bi bi-exclamation-triangle fs-1 mb-2 d-block"></i>
                          <strong>No screenshot uploaded</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <strong>Date & Time:</strong>
                  <div className="mt-2">
                    <div><strong>Date:</strong> {new Date(selectedDeposit.createdAt).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> {new Date(selectedDeposit.createdAt).toLocaleTimeString('en-US', {hour12: false})}</div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer style={{backgroundColor: '#2a2a2a', borderColor: '#444'}}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DepositRequests;