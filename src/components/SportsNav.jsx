import { Container, Row, Col } from 'react-bootstrap';

function SportsNav() {
  const sports = [
    { icon: 'bi-trophy', name: 'Cricket', count: '45' },
    { icon: 'bi-dribbble', name: 'Football', count: '32' },
    { icon: 'bi-circle', name: 'Tennis', count: '18' },
    { icon: 'bi-basketball', name: 'Basketball', count: '12' },
    { icon: 'bi-dice-1', name: 'Casino', count: '25' },
    { icon: 'bi-suit-spade', name: 'Cards', count: '8' }
  ];

  return (
    <Container>
      <div className="sports-nav">
        <Row>
          {sports.map((sport, index) => (
            <Col lg={2} md={4} sm={6} key={index} className="mb-3">
              <div className="sport-item">
                <div className="sport-icon">
                  <i className={sport.icon}></i>
                </div>
                <h6 className="mb-1">{sport.name}</h6>
                <small className="text-muted">{sport.count} Events</small>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>
  );
}

export default SportsNav;