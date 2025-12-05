import { Container, Row, Col } from 'react-bootstrap';

function Services() {
  const services = [
    {
      icon: 'bi-people',
      title: 'EXCHANGE MASTER ACCOUNTS',
      description: 'Get Master Account IDs for top betting exchanges'
    },
    {
      icon: 'bi-file-text',
      title: 'WHITELABEL SPORTS EXCHANGE',
      description: 'Launch your own branded sports betting platform'
    },
    {
      icon: 'bi-megaphone',
      title: 'DIGITAL MARKETING',
      description: 'Grow your customer base with expert marketing'
    },
    {
      icon: 'bi-wallet2',
      title: 'PAYMENT SOLUTIONS',
      description: 'Secure and fast payment processing'
    },
    {
      icon: 'bi-code-slash',
      title: 'SPORTSBOOK/EXCHANGE IFRAMES',
      description: 'Integrate gaming solutions into your platform'
    },
    {
      icon: 'bi-currency-exchange',
      title: 'BETTING RATE APIS',
      description: 'Real-time betting odds and rates API integration'
    },
    {
      icon: 'bi-dice-5',
      title: 'INDIAN CASINOS',
      description: 'Premium Indian casino gaming solutions'
    },
    {
      icon: 'bi-globe',
      title: 'INTERNATIONAL CASINOS',
      description: 'Global casino platform integration'
    }
  ];

  return (
    <section id="services" className="services-section">
      <Container>
        <div className="section-header">
          <div className="section-line"></div>
          <p className="section-subtitle">
            Business to Business (B2B) Solutions
          </p>
          <h2 className="section-title">Launch Your Betting Empire</h2>
          <p className="section-description">
            At 1MindExch we are providing all kind of Master & Super Master Accounts! Our sports betting exchange
            master accounts make your betting business easy.
          </p>
        </div>

        <Row>
          {services.map((service, index) => (
            <Col lg={3} md={6} key={index} className="mb-4">
              <div className="service-card">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Services;