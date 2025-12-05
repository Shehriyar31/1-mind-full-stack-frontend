import { Container, Row, Col, Button, Badge } from 'react-bootstrap';

function PopularGames() {
  const popularGames = [
    {
      name: 'Teen Patti Gold',
      players: '2.5K+',
      status: 'Hot',
      icon: 'bi-suit-heart',
      color: '#e74c3c'
    },
    {
      name: 'Andar Bahar',
      players: '1.8K+',
      status: 'Live',
      icon: 'bi-suit-club',
      color: '#2c3e50'
    },
    {
      name: 'Dragon Tiger',
      players: '3.2K+',
      status: 'Popular',
      icon: 'bi-lightning',
      color: '#f39c12'
    },
    {
      name: 'Roulette Pro',
      players: '1.2K+',
      status: 'New',
      icon: 'bi-circle',
      color: '#27ae60'
    },
    {
      name: 'Blackjack 21',
      players: '950+',
      status: 'Classic',
      icon: 'bi-suit-spade',
      color: '#8e44ad'
    },
    {
      name: 'Baccarat VIP',
      players: '750+',
      status: 'VIP',
      icon: 'bi-gem',
      color: '#e67e22'
    }
  ];

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h2 className="text-center mb-5" style={{color: '#1a1a1a', fontWeight: 'bold'}}>
            <i className="bi bi-fire me-2" style={{color: '#667eea'}}></i>
            Popular Games
          </h2>
        </Col>
      </Row>
      <Row>
        {popularGames.map((game, index) => (
          <Col lg={4} md={6} key={index} className="mb-4">
            <div className="betting-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Badge 
                  bg={game.status === 'Live' ? 'danger' : game.status === 'Hot' ? 'warning' : 'primary'}
                  className="text-dark"
                >
                  <i className="bi bi-circle-fill me-1"></i>
                  {game.status}
                </Badge>
                <small className="text-muted">
                  <i className="bi bi-people me-1"></i>
                  {game.players} Playing
                </small>
              </div>
              
              <div className="text-center mb-3">
                <div style={{fontSize: '3rem', color: game.color, marginBottom: '15px'}}>
                  <i className={game.icon}></i>
                </div>
                <h5 style={{color: '#1a1a1a', fontWeight: 'bold'}}>{game.name}</h5>
              </div>
              
              <div className="d-grid gap-2">
                <Button className="play-button">
                  <i className="bi bi-play-fill me-2"></i>
                  Play Now
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <i className="bi bi-info-circle me-1"></i>
                  Game Rules
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PopularGames;