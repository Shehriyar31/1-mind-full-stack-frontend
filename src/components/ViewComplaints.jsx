import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import DashboardFooter from './DashboardFooter';

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/Users/Login');
    } else {
      loadComplaints();
    }
  }, [navigate]);

  const loadComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Failed to load complaints');
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        toast.success(`Complaint ${status} successfully`);
        loadComplaints();
      } else {
        toast.error('Failed to update complaint status');
      }
    } catch (error) {
      toast.error('Error updating complaint status');
    }
  };

  const deleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Complaint deleted successfully');
          loadComplaints();
        } else {
          toast.error('Failed to delete complaint');
        }
      } catch (error) {
        toast.error('Error deleting complaint');
      }
    }
  };

  const viewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };



  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">User Complaints</h2>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">All Complaints</h4>
                <Button className="vip-submit-btn" onClick={loadComplaints}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
              </div>
              
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Account Username</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(complaint => (
                    <tr key={complaint.id}>
                      <td>{complaint.userFullName}</td>
                      <td><span className="text-info">{complaint.accountUsername || 'N/A'}</span></td>
                      <td>
                        <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {complaint.message}
                        </div>
                      </td>
                      <td>
                        <Badge bg={complaint.status === 'resolved' ? 'success' : complaint.status === 'pending' ? 'warning' : 'info'}>
                          {complaint.status}
                        </Badge>
                      </td>
                      <td>
                        {new Date(complaint.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">{new Date(complaint.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                      </td>
                      <td>
                        <Button 
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => viewComplaint(complaint)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        {complaint.status === 'pending' && (
                          <Button 
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                          >
                            <i className="bi bi-check"></i>
                          </Button>
                        )}
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => deleteComplaint(complaint.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {complaints.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">No complaints found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>

      {/* View Complaint Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          {selectedComplaint && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>User:</strong> {selectedComplaint.userFullName}
                </Col>
                <Col md={6}>
                  <strong>Account Username:</strong> <span className="text-info">{selectedComplaint.accountUsername || 'N/A'}</span>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}
                </Col>
                <Col md={6}>
                  <strong>Status:</strong> 
                  <Badge bg={selectedComplaint.status === 'resolved' ? 'success' : 'warning'} className="ms-2">
                    {selectedComplaint.status}
                  </Badge>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <strong>Message:</strong>
                  <div className="mt-2 p-3" style={{backgroundColor: '#2a2a2a', borderRadius: '5px'}}>
                    {selectedComplaint.message}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedComplaint && selectedComplaint.status === 'pending' && (
            <Button 
              variant="success"
              onClick={() => {
                updateComplaintStatus(selectedComplaint.id, 'resolved');
                setShowModal(false);
              }}
            >
              Mark as Resolved
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <DashboardFooter />
    </div>
  );
}

export default ViewComplaints;