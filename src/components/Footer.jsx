import { Container, Row, Col, Button } from 'react-bootstrap';
import logo from '../assets/1mind.jpg';

function Footer() {
  return (
    <footer className="footer-bg">
      <Container>
        {/* Main Footer Content */}
        <Row className="footer-main">
          <Col lg={4} md={6} className="mb-5">
            <div className="footer-brand-section">
              <div className="d-flex align-items-center mb-4">
                <img src={logo} alt="1MindExch" className="footer-logo" />
                <h3 className="footer-brand-title">1MINDEXCH</h3>
              </div>
              <p className="footer-description">
                Your ultimate partner in launching a successful betting and casino business. 
                We provide premium exchange accounts and white-label solutions.
              </p>
              <div className="footer-stats">
                <div className="stat-item">
                  <div className="stat-number">40+</div>
                  <div className="stat-label">Premium Exchanges</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-5">
            <div className="footer-section">
              <h5 className="footer-title">
                <i className="bi bi-globe me-2"></i>
                Exchanges
              </h5>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Bpexch.net</a></li>
                <li><a href="#" className="footer-link">Bpexch24.com</a></li>
                <li><a href="#" className="footer-link">Lgexch.live</a></li>
                <li><a href="#" className="footer-link">Betmax.gold</a></li>
                <li><a href="#" className="footer-link">Fi9exch.com</a></li>
                <li><a href="#" className="footer-link">View All 40+</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-5">
            <div className="footer-section">
              <h5 className="footer-title">
                <i className="bi bi-person-badge me-2"></i>
                Account Types
              </h5>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Super Admin</a></li>
                <li><a href="#" className="footer-link">Admin</a></li>
                <li><a href="#" className="footer-link">Super Master</a></li>
                <li><a href="#" className="footer-link">Master</a></li>
                <li><a href="#" className="footer-link">Client ID</a></li>
              </ul>
            </div>
          </Col>
          
          <Col lg={4} md={6} className="mb-5">
            <div className="footer-section">
              <h5 className="footer-title">
                <i className="bi bi-headset me-2"></i>
                Get In Touch
              </h5>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="bi bi-whatsapp contact-icon"></i>
                  <div>
                    <div className="contact-label">WhatsApp</div>
                    <div className="contact-value">+92 306 1823657</div>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="bi bi-geo-alt contact-icon"></i>
                  <div>
                    <div className="contact-label">Location</div>
                    <div className="contact-value">Pakistan</div>
                  </div>
                </div>
                <div className="contact-item">
                  <i className="bi bi-clock contact-icon"></i>
                  <div>
                    <div className="contact-label">Support Hours</div>
                    <div className="contact-value">24/7 Available</div>
                  </div>
                </div>
              </div>
              
              <div className="footer-cta mt-4">
                <Button 
                  className="footer-whatsapp-btn"
                  onClick={() => window.open('https://wa.me/923061823657?text=Hi, I want to get account information from 1MindExch', '_blank')}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Contact on WhatsApp
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright">
                © 2024 <span className="brand-highlight">1MindExch</span>. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="footer-badges">
                <span className="security-badge">
                  <i className="bi bi-shield-check me-1"></i>
                  100% Secure
                </span>
                <span className="trust-badge">
                  <i className="bi bi-award me-1"></i>
                  Trusted Platform
                </span>
                <span className="location-badge">
                  <i className="bi bi-geo-alt me-1"></i>
                  Made in Pakistan 🇵🇰
                </span>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;