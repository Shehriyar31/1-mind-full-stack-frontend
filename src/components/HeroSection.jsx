import { Container, Row, Col, Button } from 'react-bootstrap';

function HeroSection() {
  return (
    <section id="home" className="hero-section">
      <Container>
        <Row>
          <Col className="hero-content">
            <h1 className="hero-title">
              START YOUR OWN BETTING AND CASINO BUSINESS
            </h1>
            <p className="hero-subtitle">
              Get your own Master and Agent Account IDs from Top Exchanges. At 1MindExch Explore the ultimate gaming
              solution, serving top exchanges, casinos, sportsbooks, and more. Launch your brand effortlessly with our
              white label solutions.
            </p>
            <Button 
              className="btn-primary-custom"
              onClick={() => window.open('https://wa.me/923061823657?text=Hi, I want to start my own betting and casino business with 1MindExch', '_blank')}
            >
              <i className="bi bi-whatsapp me-2"></i>
              GET STARTED →
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;