import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function ApprovedAccounts() {
  const [approvedAccounts, setApprovedAccounts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();
  const [editData, setEditData] = useState({
    username: '',
    password: '',
    link: '',
    status: 'active'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/Users/Login');
    } else {
      loadApprovedAccounts();
    }
  }, [navigate]);

  const loadApprovedAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/account-requests');
      const data = await response.json();
      const approved = data.filter(req => req.status === 'approved');
      setApprovedAccounts(approved);
    } catch (error) {
      console.error('Failed to load approved accounts');
      toast.error('Failed to load approved accounts');
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setEditData({
      username: account.accountDetails?.username || '',
      password: account.accountDetails?.password || '',
      link: account.accountDetails?.link || '',
      status: account.accountDetails?.status || 'active'
    });
    setShowEditModal(true);
  };

  const updateAccount = async () => {
    if (!editData.username || !editData.password || !editData.link) {
      toast.error('Please fill all fields');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/account-requests/${editingAccount.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      
      if (response.ok) {
        toast.success('Account updated successfully');
        setShowEditModal(false);
        loadApprovedAccounts();
      } else {
        toast.error('Failed to update account');
      }
    } catch (error) {
      toast.error('Failed to update account');
    }
  };

  const deleteAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this approved account?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/account-requests/${accountId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Account deleted successfully');
          loadApprovedAccounts();
        } else {
          toast.error('Failed to delete account');
        }
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">Approved Accounts</h2>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">All Approved Accounts</h4>
                <Button className="vip-submit-btn" onClick={loadApprovedAccounts}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Platform</th>
                    <th>Account Username</th>
                    <th>Password</th>
                    <th>Link</th>
                    <th>Account Status</th>
                    <th>Approved Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedAccounts.map(account => (
                    <tr key={account.id}>
                      <td>{account.userFullName}</td>
                      <td>{account.platform}</td>
                      <td>{account.accountDetails?.username || '-'}</td>
                      <td>{account.accountDetails?.password || '-'}</td>
                      <td>
                        {account.accountDetails?.link ? (
                          <a 
                            href={account.accountDetails.link.startsWith('http') ? account.accountDetails.link : `https://${account.accountDetails.link}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-info"
                          >
                            <i className="bi bi-link-45deg"></i> Link
                          </a>
                        ) : '-'}
                      </td>
                      <td>
                        <Badge bg={account.accountDetails?.status === 'active' ? 'success' : 'danger'}>
                          {account.accountDetails?.status === 'active' ? '✓ Active' : '✗ Inactive'}
                        </Badge>
                      </td>
                      <td>
                        {account.accountDetails?.approvedAt ? (
                          <>
                            {new Date(account.accountDetails.approvedAt).toLocaleDateString()}<br/>
                            <small className="text-muted">{new Date(account.accountDetails.approvedAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                          </>
                        ) : '-'}
                      </td>
                      <td>
                        <Button 
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditAccount(account)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => deleteAccount(account.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {approvedAccounts.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center text-muted">No approved accounts found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Edit Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Platform</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editingAccount?.platform || ''}
                disabled
                style={{backgroundColor: '#2a2a2a', color: '#fff', cursor: 'not-allowed'}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Username</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                placeholder="Enter account username"
                value={editData.username}
                onChange={(e) => setEditData({...editData, username: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                placeholder="Enter account password"
                value={editData.password}
                onChange={(e) => setEditData({...editData, password: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Link</Form.Label>
              <Form.Control
                type="url"
                className="vip-input"
                placeholder="Enter platform link"
                value={editData.link}
                onChange={(e) => setEditData({...editData, link: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="text-light">Account Status</Form.Label>
              <Form.Select
                className="vip-input"
                value={editData.status}
                onChange={(e) => setEditData({...editData, status: e.target.value})}
                style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
              >
                <option value="active" style={{backgroundColor: '#2a2a2a', color: '#28a745'}}>✓ Active</option>
                <option value="inactive" style={{backgroundColor: '#2a2a2a', color: '#dc3545'}}>✗ Inactive</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button className="vip-submit-btn" onClick={updateAccount}>
                <i className="bi bi-check me-2"></i>Update Account
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ApprovedAccounts;