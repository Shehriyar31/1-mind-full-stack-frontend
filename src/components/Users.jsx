import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from './AdminNavbar';
import useAutoLogout from '../utils/useAutoLogout';

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();
  const [formData, setFormData] = useState({
    regNumber: '',
    fullName: '',
    username: '',
    whatsapp: '',
    password: '',
    role: 'bettor',
    isActive: true
  });
  const [editFormData, setEditFormData] = useState({
    password: '',
    isActive: true
  });

  const generateRegNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleShowModal = () => {
    setFormData({
      regNumber: generateRegNumber(),
      fullName: '',
      username: '',
      whatsapp: '',
      password: '',
      role: 'bettor',
      isActive: true
    });
    setShowModal(true);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/Users/Login');
    } else {
      loadUsers();
    }
  }, [navigate]);

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users');
      const data = await response.json();
      console.log('Loaded users:', data); // Debug log
      console.log('First user:', data[0]); // Check first user structure
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Failed to load users');
      toast.error('Failed to load users');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${userId}/status`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        loadUsers();
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('User deleted successfully');
          // Remove user from local state immediately
          const updatedUsers = users.filter(user => user._id !== userId);
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.whatsapp && user.whatsapp.includes(searchTerm))
          ));
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({ password: '', isActive: user.isActive });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    const updateData = { isActive: editFormData.isActive };
    if (editFormData.password.trim()) {
      updateData.password = editFormData.password;
    }
    
    try {
      await fetch(`http://localhost:5000/api/auth/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      toast.success('User updated successfully');
      setShowEditModal(false);
      setEditingUser(null);
      setEditFormData({ password: '', isActive: true });
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(term.toLowerCase()) ||
        (user.whatsapp && user.whatsapp.includes(term))
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    // Validate WhatsApp number
    if (!/^03[0-9]{9}$/.test(formData.whatsapp)) {
      toast.error('WhatsApp number must start with 03 and be 11 digits long');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('User added successfully!');
        setShowModal(false);
        setFormData({ regNumber: '', fullName: '', username: '', whatsapp: '', password: '', role: 'bettor', isActive: true });
        loadUsers();
      } else {
        const error = await response.json();
        if (error.message.includes('username')) {
          toast.error('Username already exists');
        } else if (error.message.includes('whatsapp')) {
          toast.error('WhatsApp number already registered');
        } else {
          toast.error(error.message || 'Failed to add user');
        }
      }
    } catch (error) {
      toast.error('Error adding user');
    }
  };

  return (
    <div className="vip-auth-page">
      <AdminNavbar />
      <Container className="py-5">
        <Row className="mb-4">
          <Col>
            <div className="vip-auth-card text-center">
              <h2 className="vip-brand-title mb-0">User Management</h2>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="vip-auth-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-light">All Users</h4>
                <div>
                  <Button className="vip-submit-btn me-2" onClick={handleShowModal}>
                    <i className="bi bi-person-plus me-2"></i>Add User
                  </Button>
                  <Button className="vip-submit-btn" onClick={loadUsers}>
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                  </Button>
                </div>
              </div>
              
              <div className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by username or WhatsApp number..."
                  className="vip-input"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{maxWidth: '400px'}}
                />
              </div>
              
              {/* Desktop Table */}
              <Table responsive variant="dark">
                <thead>
                  <tr>
                    <th>Reg #</th>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>WhatsApp</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user.regNumber || 'OLD'}</td>
                      <td>{user.fullName}</td>
                      <td>{user.username}</td>
                      <td>{user.whatsapp || 'Not Set'}</td>
                      <td>
                        <Badge bg={user.isActive ? 'success' : 'danger'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        {user.createdAt ? (
                          <>
                            {new Date(user.createdAt).toLocaleDateString()}<br/>
                            <small className="text-muted">{new Date(user.createdAt).toLocaleTimeString('en-US', {hour12: false})}</small>
                          </>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <Button 
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditUser(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => deleteUser(user._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && searchTerm && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">No users found matching "{searchTerm}"</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              
              {/* Mobile Cards */}
              <div className="mobile-user-cards">
                {filteredUsers.map(user => (
                  <div key={user._id} className="user-card">
                    <div className="user-card-header">
                      <div className="user-reg-number">#{user.regNumber || 'OLD'}</div>
                      <Badge bg={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="user-card-body">
                      <div className="user-info-row">
                        <span className="user-info-label">Name:</span>
                        <span className="user-info-value">{user.fullName}</span>
                      </div>
                      <div className="user-info-row">
                        <span className="user-info-label">Username:</span>
                        <span className="user-info-value">{user.username}</span>
                      </div>
                      <div className="user-info-row">
                        <span className="user-info-label">WhatsApp:</span>
                        <span className="user-info-value">{user.whatsapp || 'Not Set'}</span>
                      </div>
                      <div className="user-info-row">
                        <span className="user-info-label">Date:</span>
                        <span className="user-info-value">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="user-card-actions">
                      <Button 
                        variant="primary"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </Button>
                      <Button 
                        variant="danger"
                        size="sm"
                        onClick={() => deleteUser(user._id)}
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && searchTerm && (
                  <div className="text-center text-muted py-4">
                    No users found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form onSubmit={handleAddUser}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Registration Number</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={formData.regNumber}
                disabled
                style={{backgroundColor: '#2a2a2a', color: '#28a745', cursor: 'not-allowed', fontWeight: 'bold'}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Full Name</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Username</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">WhatsApp Number</Form.Label>
              <Form.Control
                type="tel"
                className="vip-input"
                placeholder="03XXXXXXXXX (11 digits)"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                pattern="^03[0-9]{9}$"
                maxLength="11"
                title="WhatsApp number must start with 03 and be 11 digits long"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="password"
                className="vip-input"
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                minLength="6"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Role</Form.Label>
              <Form.Select
                className="vip-input"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
              >
                <option value="bettor" style={{backgroundColor: '#2a2a2a', color: '#17a2b8'}}>👤 Bettor</option>
                <option value="admin" style={{backgroundColor: '#2a2a2a', color: '#ffc107'}}>⚡ Admin</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                label="Active User"
                className="text-light"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="vip-submit-btn">
                <i className="bi bi-person-plus me-2"></i>Add User
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
          <Form onSubmit={handleUpdateUser}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Registration Number</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editingUser?.regNumber || 'OLD'}
                disabled
                style={{backgroundColor: '#2a2a2a', color: '#fff', cursor: 'not-allowed'}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Full Name</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editingUser?.fullName || ''}
                disabled
                style={{backgroundColor: '#2a2a2a', color: '#fff', cursor: 'not-allowed'}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Username</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editingUser?.username || ''}
                disabled
                style={{backgroundColor: '#2a2a2a', color: '#fff', cursor: 'not-allowed'}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">WhatsApp Number</Form.Label>
              <Form.Control
                type="text"
                className="vip-input"
                value={editingUser?.whatsapp || 'Not Set'}
                disabled
                style={{backgroundColor: '#2a2a2a', color: '#fff', cursor: 'not-allowed'}}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="text-light">New Password</Form.Label>
              <Form.Control
                type="password"
                className="vip-input"
                placeholder="Enter new password (optional)"
                value={editFormData.password}
                onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="text-light">Status</Form.Label>
              <Form.Select
                className="vip-input"
                value={editFormData.isActive ? 'true' : 'false'}
                onChange={(e) => setEditFormData({...editFormData, isActive: e.target.value === 'true'})}
                style={{backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444'}}
              >
                <option value="true" style={{backgroundColor: '#2a2a2a', color: '#28a745'}}>✓ Active</option>
                <option value="false" style={{backgroundColor: '#2a2a2a', color: '#dc3545'}}>✗ Inactive</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="vip-submit-btn">
                <i className="bi bi-check me-2"></i>Update Password
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Users;