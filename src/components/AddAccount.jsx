import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

function AddBankAccount() {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountTitle: ''
  });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editData, setEditData] = useState({
    bankName: '',
    accountNumber: '',
    accountTitle: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
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

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setEditData({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountTitle: account.accountTitle
    });
    setShowEditModal(true);
  };

  const updateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bank-accounts/${editingAccount.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      
      if (response.ok) {
        toast.success('Bank account updated successfully');
        setShowEditModal(false);
        loadBankAccounts();
      } else {
        toast.error('Failed to update bank account');
      }
    } catch (error) {
      toast.error('Failed to update bank account');
    }
  };

  const deleteAccount = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this bank account?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/bank-accounts/${accountId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Bank account deleted successfully');
          loadBankAccounts();
        } else {
          toast.error('Failed to delete bank account');
        }
      } catch (error) {
        toast.error('Failed to delete bank account');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/bank-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Bank account added successfully!');
        setFormData({ bankName: '', accountNumber: '', accountTitle: '' });
        loadBankAccounts();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add bank account');
      }
    } catch (error) {
      toast.error('Error adding bank account');
    }
  };

  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="vip-auth-card">
              <div className="text-center mb-4">
                <h2 className="vip-brand-title">Add Bank Account</h2>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="vip-input"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="vip-input"
                    placeholder="Enter account number (numbers only)"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setFormData({...formData, accountNumber: value});
                    }}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Account Title</Form.Label>
                  <Form.Control
                    type="text"
                    className="vip-input"
                    placeholder="Enter account title/holder name"
                    value={formData.accountTitle}
                    onChange={(e) => setFormData({...formData, accountTitle: e.target.value})}
                    required
                  />
                </Form.Group>

                <div className="text-center mb-4">
                  <Button type="submit" className="vip-submit-btn me-3">
                    <i className="bi bi-bank me-2"></i>Add Bank Account
                  </Button>
                  <Button 
                    variant="outline-light" 
                    onClick={() => navigate('/Admin/Dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col>
            <div className="vip-auth-card">
              <h4 className="text-light mb-3">All Bank Accounts</h4>
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Account Number</th>
                    <th>Account Title</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bankAccounts.map(account => (
                    <tr key={account.id}>
                      <td>{account.bankName}</td>
                      <td>{account.accountNumber}</td>
                      <td>{account.accountTitle}</td>
                      <td>{new Date(account.createdAt).toLocaleDateString()}</td>
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
                  {bankAccounts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">No bank accounts added yet</td>
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
          <Modal.Title>Edit Bank Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Bank Name</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editData.bankName}
                onChange={(e) => setEditData({...editData, bankName: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Account Number</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                placeholder="Numbers only"
                value={editData.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setEditData({...editData, accountNumber: value});
                }}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="text-light">Account Title</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editData.accountTitle}
                onChange={(e) => setEditData({...editData, accountTitle: e.target.value})}
                required
              />
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

export default AddBankAccount;