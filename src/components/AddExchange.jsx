import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';

function AddExchange() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    commission: '',
    status: 'active',
    minDeposit: '500'
  });
  const [exchanges, setExchanges] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/exchanges');
      const data = await response.json();
      setExchanges(data);
    } catch (error) {
      console.error('Failed to load exchanges');
    }
  };

  const deleteExchange = async (id) => {
    if (window.confirm('Are you sure you want to delete this exchange?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/exchanges/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Exchange deleted successfully');
          loadExchanges();
        } else {
          toast.error('Failed to delete exchange');
        }
      } catch (error) {
        toast.error('Failed to delete exchange');
      }
    }
  };

  const editExchange = (exchange) => {
    setFormData({
      name: exchange.name,
      type: '',
      commission: '',
      status: 'active',
      minDeposit: exchange.minDeposit
    });
    setEditingId(exchange.id);
  };

  const cancelEdit = () => {
    setFormData({ name: '', type: '', commission: '', status: 'active', minDeposit: '500' });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:5000/api/exchanges/${editingId}`
        : 'http://localhost:5000/api/exchanges';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name,
          minDeposit: formData.minDeposit
        })
      });
      
      if (response.ok) {
        toast.success(editingId ? 'Exchange updated successfully!' : 'Exchange added successfully!');
        setFormData({ name: '', type: '', commission: '', status: 'active', minDeposit: '500' });
        setEditingId(null);
        loadExchanges();
      } else {
        const error = await response.json();
        toast.error(error.message || `Failed to ${editingId ? 'update' : 'add'} exchange`);
      }
    } catch (error) {
      toast.error(`Error ${editingId ? 'updating' : 'adding'} exchange`);
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
                <h2 className="vip-brand-title">{editingId ? 'Edit Exchange Account' : 'Add Exchange Account'}</h2>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Exchange Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="vip-input"
                    placeholder="Enter exchange name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Minimum Deposit (PKR)</Form.Label>
                  <Form.Control
                    type="number"
                    className="vip-input"
                    placeholder="Enter minimum deposit amount"
                    min="100"
                    value={formData.minDeposit}
                    onChange={(e) => setFormData({...formData, minDeposit: e.target.value})}
                    required
                  />
                </Form.Group>

                <div className="text-center mb-4">
                  <Button type="submit" className="vip-submit-btn me-3">
                    <i className={`bi ${editingId ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                    {editingId ? 'Update Exchange' : 'Add Exchange'}
                  </Button>
                  {editingId && (
                    <Button 
                      variant="secondary"
                      className="me-3"
                      onClick={cancelEdit}
                    >
                      Cancel Edit
                    </Button>
                  )}
                  <Button 
                    variant="outline-light" 
                    onClick={() => navigate('/Admin/Dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col>
            <div className="vip-auth-card">
              <h4 className="text-light mb-3">All Exchanges</h4>
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>Exchange Name</th>
                    <th>Minimum Deposit</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exchanges.map(exchange => (
                    <tr key={exchange.id}>
                      <td>{exchange.name}</td>
                      <td>PKR {exchange.minDeposit}</td>
                      <td>{new Date(exchange.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => editExchange(exchange)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => deleteExchange(exchange.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {exchanges.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">No exchanges added yet</td>
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

export default AddExchange;