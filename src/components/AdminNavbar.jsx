import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAutoLogout from '../utils/useAutoLogout';

function AdminNavbar() {
  const [requestCount, setRequestCount] = useState(0);
  const [depositCount, setDepositCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Auto logout after 5 minutes of inactivity
  useAutoLogout();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setExpanded(false);
    navigate('/Users/Login');
  };

  useEffect(() => {
    loadRequestCount();
    loadDepositCount();
    // Refresh count every 30 seconds
    const interval = setInterval(() => {
      loadRequestCount();
      loadDepositCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadRequestCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/account-requests');
      const data = await response.json();
      const pendingRequests = data.filter(req => req.status === 'pending');
      setRequestCount(pendingRequests.length);
    } catch (error) {
      console.error('Failed to load request count');
    }
  };

  const loadDepositCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/deposit-requests');
      const data = await response.json();
      const pendingDeposits = data.filter(req => req.status === 'pending');
      setDepositCount(pendingDeposits.length);
    } catch (error) {
      console.error('Failed to load deposit count');
    }
  };

  return (
    <Navbar expand="lg" className="admin-navbar mb-4" expanded={expanded}>
      <Container>
        <Navbar.Brand className="text-light fw-bold">1MINDEXCH - Admin Panel</Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="admin-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
          className="admin-navbar-toggler"
        >
          <span className="navbar-toggler-icon-custom">
            <i className={`bi ${expanded ? 'bi-x' : 'bi-list'} text-light`} style={{fontSize: '1.5rem'}}></i>
          </span>
        </Navbar.Toggle>
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link 
              as={Link} 
              to="/Admin/Dashboard" 
              className={`admin-nav-link ${isActive('/Admin/Dashboard') ? 'active' : ''}`} 
              onClick={() => setExpanded(false)}
            >
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Nav.Link>
            
            <NavDropdown 
              title={<><i className="bi bi-gear me-2"></i>Administrative Tasks <i className="bi bi-chevron-down ms-1"></i></>} 
              id="admin-tasks-dropdown"
              className="admin-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/Account" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-people me-2"></i>Users
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/Add/Exchange/Account" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-plus-circle me-2"></i>Add Exchange
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/Add/Account" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-bank me-2"></i>Add Bank Account
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown 
              title={<><i className="bi bi-file-earmark-text me-2"></i>Requests <i className="bi bi-chevron-down ms-1"></i></>} 
              id="requests-dropdown"
              className="admin-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/Deposit/Requests" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-arrow-down-circle me-2"></i>Deposit Requests
                {depositCount > 0 && (
                  <Badge bg="danger" className="ms-2">{depositCount}</Badge>
                )}
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/Withdraw/Requests" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-arrow-up-circle me-2"></i>Withdraw Requests
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown 
              title={<><i className="bi bi-check2-square me-2"></i>Approvals <i className="bi bi-chevron-down ms-1"></i></>} 
              id="approvals-dropdown"
              className="admin-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/View/New/AccountRequest" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-person-check me-2"></i>Account Requests
                {requestCount > 0 && (
                  <Badge bg="danger" className="ms-2">{requestCount}</Badge>
                )}
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/Accounts/Approved" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-check-circle me-2"></i>Approved Accounts
              </NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link 
              as={Link} 
              to="/View/Complaints" 
              className={`admin-nav-link ${isActive('/View/Complaints') ? 'active' : ''}`} 
              onClick={() => setExpanded(false)}
            >
              <i className="bi bi-chat-dots me-2"></i>View Complaints
            </Nav.Link>
            
            <Nav.Link 
              onClick={handleLogout}
              className="admin-nav-link user-logout-link"
              style={{cursor: 'pointer'}}
            >
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;