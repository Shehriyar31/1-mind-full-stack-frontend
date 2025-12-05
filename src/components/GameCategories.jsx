import { Container, Row, Col, Button } from 'react-bootstrap';

function GameCategories() {
  const games = [
    {
      icon: 'bi-dice-5',
      title: 'Casino Games',
      description: 'Slots, Roulette, Blackjack & More',
      color: '#e74c3c'
    },
    {
      icon: 'bi-suit-spade',
      title: 'Card Games',
      description: 'Poker, Teen Patti, Rummy',
      color: '#2c3e50'
    },
    {
      icon: 'bi-trophy',
      title: 'Sports Betting',
      description: 'Cricket, Football, Tennis',
      color: '#f39c12'
    },
    {
      icon: 'bi-controller',
      title: 'Arcade Games',
      description: 'Fun & Exciting Mini Games',
      color: '#9b59b6'
    },
    {
      icon: 'bi-lightning-charge',
      title: 'Live Games',
      description: 'Real-time Gaming Experience',
      color: '#e67e22'
    },
    {
      icon: 'bi-gem',
      title: 'VIP Games',
      description: 'Exclusive High-Stakes Games',
      color: '#27ae60'
    }
  ];

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h2 className="text-center mb-5" style={{color: '#1a1a1a', fontWeight: 'bold'}}>
            Game Categories
          </h2>
        </Col>
      </Row>
      <Row>
        {games.map((game, index) => (
          <Col lg={4} md={6} key={index} className="mb-4">
            <div className="game-card">
              <div className="game-image">
                <i className={game.icon} style={{color: game.color}}></i>
              </div>
              <div className="p-4">
                <h5 style={{color: '#1a1a1a', fontWeight: 'bold'}}>{game.title}</h5>
                <p className="text-muted mb-3">{game.description}</p>
                <Button className="play-button w-100">
                  <i className="bi bi-play-fill me-2"></i>
                  Play Now
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default GameCategories;