import { Container, Row, Col, Button, Badge, Table } from 'react-bootstrap';

function LiveBetting() {
  const matches = [
    {
      team1: 'India',
      team2: 'Australia',
      sport: 'Cricket',
      status: 'Live',
      time: '15:30',
      back1: '1.85', lay1: '1.87',
      back2: '2.10', lay2: '2.12'
    },
    {
      team1: 'Manchester United',
      team2: 'Liverpool',
      sport: 'Football',
      status: 'Live',
      time: '18:45',
      back1: '2.50', lay1: '2.52',
      back2: '1.75', lay2: '1.77'
    },
    {
      team1: 'Mumbai Indians',
      team2: 'Chennai Super Kings',
      sport: 'Cricket',
      status: 'Starting Soon',
      time: '19:30',
      back1: '1.95', lay1: '1.97',
      back2: '1.90', lay2: '1.92'
    }
  ];

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h2 className="text-center mb-5" style={{color: '#1a1a1a', fontWeight: 'bold'}}>
            <i className="bi bi-broadcast-pin me-2" style={{color: '#ff6b35'}}></i>
            Live In-Play Markets
          </h2>
        </Col>
      </Row>
      
      {matches.map((match, index) => (
        <Row key={index} className="mb-4">
          <Col>
            <div className="betting-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <Badge bg={match.status === 'Live' ? 'danger' : 'warning'} className="me-2">
                    <i className="bi bi-circle-fill me-1"></i>
                    {match.status}
                  </Badge>
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {match.time}
                  </small>
                </div>
                <small className="text-muted">
                  <i className="bi bi-trophy me-1"></i>
                  {match.sport}
                </small>
              </div>
              
              <h5 className="mb-4 text-center" style={{color: '#1a1a1a'}}>
                {match.team1} vs {match.team2}
              </h5>
              
              <Table responsive className="mb-0">
                <thead>
                  <tr className="text-center">
                    <th style={{color: '#1a1a1a'}}>Team</th>
                    <th style={{color: '#28a745'}}>Back</th>
                    <th style={{color: '#ff6b35'}}>Lay</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td style={{fontWeight: 'bold'}}>{match.team1}</td>
                    <td>
                      <Button className="back-odds odds-button">
                        {match.back1}
                      </Button>
                    </td>
                    <td>
                      <Button className="lay-odds odds-button">
                        {match.lay1}
                      </Button>
                    </td>
                  </tr>
                  <tr className="text-center">
                    <td style={{fontWeight: 'bold'}}>{match.team2}</td>
                    <td>
                      <Button className="back-odds odds-button">
                        {match.back2}
                      </Button>
                    </td>
                    <td>
                      <Button className="lay-odds odds-button">
                        {match.lay2}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      ))}
      
      <Row>
        <Col className="text-center">
          <Button 
            size="lg" 
            style={{background: 'linear-gradient(45deg, #ff6b35, #f7931e)', border: 'none', fontWeight: 'bold'}}
            className="px-5"
          >
            <i className="bi bi-eye me-2"></i>
            View All Markets
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default LiveBetting;