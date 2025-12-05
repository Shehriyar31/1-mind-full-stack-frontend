import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function ViewAccountRequests() {
  const [requests, setRequests] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();
  const [approveData, setApproveData] = useState({
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
      loadRequests();
    }
  }, [navigate]);

  const loadRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/account-requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests');
      toast.error('Failed to load requests');
    }
  };

  const handleApproveClick = (request) => {
    setSelectedRequest(request);
    setApproveData({ username: '', password: '', link: '', status: 'active' });
    setShowApproveModal(true);
  };

  const approveRequest = async () => {
    if (!approveData.username || !approveData.password || !approveData.link) {
      toast.error('Please fill all fields');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/account-requests/${selectedRequest.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(approveData)
      });
      
      if (response.ok) {
        toast.success('Request approved successfully');
        setShowApproveModal(false);
        loadRequests();
      } else {
        toast.error('Failed to approve request');
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const deleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/account-requests/${requestId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Request deleted successfully');
          loadRequests();
        } else {
          toast.error('Failed to delete request');
        }
      } catch (error) {
        toast.error('Failed to delete request');
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
              <h2 className="vip-brand-title mb-0">New Account Requests</h2>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">All Requests</h4>
                <Button className="vip-submit-btn" onClick={loadRequests}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Platform</th>
                    <th>Username</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr key={request.id}>
                      <td>{request.userFullName}</td>
                      <td>{request.platform}</td>
                      <td>{request.username}</td>
                      <td>
                        <Badge bg="warning">
                          {request.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(request.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(request.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                      <td>
                        {request.status === 'pending' && (
                          <Button 
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => handleApproveClick(request)}
                          >
                            <i className="bi bi-check"></i>
                          </Button>
                        )}
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => deleteRequest(request.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">No requests found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Approve Account Request</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Platform</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={selectedRequest?.platform || ''}
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
                value={approveData.username}
                onChange={(e) => setApproveData({...approveData, username: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                placeholder="Enter account password"
                value={approveData.password}
                onChange={(e) => setApproveData({...approveData, password: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Link</Form.Label>
              <Form.Control
                type="url"
                className="vip-input"
                placeholder="Enter platform link"
                value={approveData.link}
                onChange={(e) => setApproveData({...approveData, link: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="text-light">Account Status</Form.Label>
              <Form.Select
                className="vip-input"
                value={approveData.status}
                onChange={(e) => setApproveData({...approveData, status: e.target.value})}
                style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
              >
                <option value="active" style={{backgroundColor: '#2a2a2a', color: '#28a745'}}>✓ Active</option>
                <option value="inactive" style={{backgroundColor: '#2a2a2a', color: '#dc3545'}}>✗ Inactive</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowApproveModal(false)}>
                Cancel
              </Button>
              <Button className="vip-submit-btn" onClick={approveRequest}>
                <i className="bi bi-check me-2"></i>Approve Account
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ViewAccountRequests;