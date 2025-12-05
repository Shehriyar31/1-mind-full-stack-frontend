import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';

function UserNavbar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    toast.success('Logged out successfully');
    setExpanded(false);
    navigate('/Users/Login');
  };

  return (
    <Navbar expand="lg" className="admin-navbar mb-4" expanded={expanded}>
      <Container>
        <Navbar.Brand className="text-light fw-bold">1MINDEXCH - User Panel</Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="user-navbar-nav" 
          onClick={() => setExpanded(!expanded)}
          className="admin-navbar-toggler"
        >
          <span className="navbar-toggler-icon-custom">
            <i className={`bi ${expanded ? 'bi-x' : 'bi-list'} text-light`} style={{fontSize: '1.5rem'}}></i>
          </span>
        </Navbar.Toggle>
        <Navbar.Collapse id="user-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link 
              as={Link} 
              to="/User/Dashboard" 
              className={`admin-nav-link ${isActive('/User/Dashboard') ? 'active' : ''}`}
              onClick={() => setExpanded(false)}
            >
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Nav.Link>
            
            <NavDropdown 
              title={<><i className="bi bi-person-circle me-2"></i>Accounts <i className="bi bi-chevron-down ms-1"></i></>} 
              id="accounts-dropdown"
              className="admin-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/User/New/Account" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-person-plus me-2"></i>New Account
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/User/View/Account" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-eye me-2"></i>View Account
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown 
              title={<><i className="bi bi-file-earmark-text me-2"></i>Requests <i className="bi bi-chevron-down ms-1"></i></>} 
              id="requests-dropdown"
              className="admin-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/User/Deposit" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-plus-circle me-2"></i>Deposit Request
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/User/Withdraw" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-dash-circle me-2"></i>Withdraw Request
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown 
              title={<><i className="bi bi-clock-history me-2"></i>History <i className="bi bi-chevron-down ms-1"></i></>} 
              id="history-dropdown"
              className="admin-dropdown"
            >
              <NavDropdown.Item 
                as={Link} 
                to="/User/Deposit/History" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-arrow-down-circle me-2"></i>Deposit History
              </NavDropdown.Item>
              <NavDropdown.Item 
                as={Link} 
                to="/User/Withdraw/History" 
                className="admin-dropdown-item"
                onClick={() => setExpanded(false)}
              >
                <i className="bi bi-arrow-up-circle me-2"></i>Withdraw History
              </NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link 
              as={Link} 
              to="/User/Complain" 
              className={`admin-nav-link ${isActive('/User/Complain') ? 'active' : ''}`}
              onClick={() => setExpanded(false)}
            >
              <i className="bi bi-chat-dots me-2"></i>Complain
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

export default UserNavbar;