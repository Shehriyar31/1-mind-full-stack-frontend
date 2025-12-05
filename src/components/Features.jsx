import { Container, Row, Col } from 'react-bootstrap';

function Features() {
  const features = [
    {
      icon: 'bi-shield-check',
      title: 'Secure Gaming',
      description: 'Bank-grade security with SSL encryption for safe gaming'
    },
    {
      icon: 'bi-lightning-charge',
      title: 'Instant Payouts',
      description: 'Lightning-fast withdrawals processed within minutes'
    },
    {
      icon: 'bi-gift',
      title: 'Daily Bonuses',
      description: 'Exciting daily rewards and promotional offers'
    },
    {
      icon: 'bi-phone',
      title: 'Mobile Gaming',
      description: 'Play anywhere, anytime with our mobile-optimized platform'
    },
    {
      icon: 'bi-currency-rupee',
      title: 'Easy Deposits',
      description: 'Multiple payment options including UPI, Cards & Wallets'
    },
    {
      icon: 'bi-headset',
      title: '24/7 Support',
      description: 'Round-the-clock customer support in multiple languages'
    }
  ];

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h2 className="text-center mb-5" style={{color: '#1a1a1a', fontWeight: 'bold'}}>
            Why Choose PlayProfits?
          </h2>
        </Col>
      </Row>
      <Row>
        {features.map((feature, index) => (
          <Col md={6} lg={4} key={index} className="mb-4">
            <div className="feature-card">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h5 style={{color: '#1a1a1a', fontWeight: 'bold'}}>{feature.title}</h5>
              <p className="text-muted">{feature.description}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Features;