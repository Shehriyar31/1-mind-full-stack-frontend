import { Container, Row, Col } from 'react-bootstrap';
import logo from '../assets/1mind.jpg';

function DashboardFooter() {
  return (
    <footer className="mt-auto py-4" style={{backgroundColor: '#1a1a1a', borderTop: '1px solid #333'}}>
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <div className="text-light d-flex align-items-center justify-content-center justify-content-md-start">
              <div className="me-3">
                <img 
                  src={logo} 
                  alt="1MINDEXCH Logo" 
                  style={{width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover'}}
                />
              </div>
              <div>
                <h5 className="mb-1" style={{color: '#ffc107', fontWeight: 'bold', textShadow: '0 0 10px rgba(255, 193, 7, 0.3)'}}>
                  1MINDEXCH
                </h5>
                <p className="mb-0 small" style={{color: '#17a2b8', fontStyle: 'italic'}}>Your Trusted Gaming Partner</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <div className="text-light">
              <p className="mb-0" style={{color: '#28a745', fontWeight: '500', textShadow: '0 0 5px rgba(40, 167, 69, 0.3)'}}>
                © 2025 1MINDEXCH. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default DashboardFooter;