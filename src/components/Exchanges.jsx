import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useState } from 'react';

function Exchanges() {
  const [showAll, setShowAll] = useState(false);
  
  const allExchanges = [
    { name: "Bpexch.net", icon: "BP", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#ff6b35" },
    { name: "Bpexch24.com", icon: "B24", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#7928ca" },
    { name: "Bpexch.pro", icon: "BPP", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "100", color: "#ff0080" },
    { name: "Punjabexch.com", icon: "PE", accounts: ["Admin", "Super Master", "Master", "Client Id"], minBet: "100", color: "#00d4ff" },
    { name: "Betpro.me", icon: "BPM", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#28a745" },
    { name: "Lgexch.live", icon: "LG", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#ffc107" },
    { name: "Lgexch.net", icon: "LGN", accounts: ["Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#dc3545" },
    { name: "Bmaxexch.com", icon: "BM", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#6f42c1" },
    { name: "Fastbet.live", icon: "FB", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#20c997" },
    { name: "Betmax.gold", icon: "BG", accounts: ["Super Master", "Master", "Client Id"], minBet: "500", color: "#fd7e14" },
    { name: "Ukexchanges.com", icon: "UK", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#e83e8c" },
    { name: "Bmax.gold", icon: "BMG", accounts: ["Super Master", "Master", "Client Id"], minBet: "500", color: "#17a2b8" },
    { name: "Fi9exch.com", icon: "F9", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#6610f2" },
    { name: "Mamaexch.com", icon: "MM", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#e83e8c" },
    { name: "Mamaexch.net", icon: "MMN", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#fd7e14" },
    { name: "Bestbet9.com", icon: "BB9", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#20c997" },
    { name: "Bestbet9.net", icon: "BBN", accounts: ["Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#6f42c1" },
    { name: "Bestbet9.live", icon: "BBL", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#dc3545" },
    { name: "Lotusbook.io", icon: "LB", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#ffc107" },
    { name: "Our777.com", icon: "O7", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#28a745" },
    { name: "Mony777.com", icon: "M7", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#ff0080" },
    { name: "Champbet9.com", icon: "CB9", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#00d4ff" },
    { name: "Tjexch.com", icon: "TJ", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#ff6b35" },
    { name: "Bestbook7.com", icon: "BB7", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#7928ca" },
    { name: "1obet.com", icon: "1O", accounts: ["Super Admin", "Admin", "Super Master", "Master", "Client Id"], minBet: "100", color: "#6610f2" },
    { name: "Champexch.com", icon: "CE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#e83e8c" },
    { name: "Ppexch.com", icon: "PP", accounts: ["Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#fd7e14" },
    { name: "Silverexch.com", icon: "SE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#20c997" },
    { name: "Uniquexch.net", icon: "UE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#6f42c1" },
    { name: "Tenexch.com", icon: "TE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#dc3545" },
    { name: "Bajiexch.com", icon: "BE", accounts: ["Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#ffc107" },
    { name: "Unexch.live", icon: "UL", accounts: ["Admin", "Super Master", "Master", "Client Id"], minBet: "500", color: "#28a745" },
    { name: "Wingexch666.com", icon: "WE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#ff0080" },
    { name: "Lotusbook247.com", icon: "L247", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#00d4ff" },
    { name: "Betbhai9.red", icon: "BH9", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#ff6b35" },
    { name: "Goldexch.live", icon: "GL", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#7928ca" },
    { name: "Goldenexch.com", icon: "GE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#6610f2" },
    { name: "Raisexch.com", icon: "RE", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#e83e8c" },
    { name: "Abexch.xyz", icon: "AB", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#fd7e14" },
    { name: "Abexch99.io", icon: "A99", accounts: ["Super Master", "Master", "Client Id"], minBet: "100", color: "#20c997" }
  ];
  
  const exchanges = showAll ? allExchanges : allExchanges.slice(0, 6);

  return (
    <section id="exchanges" className="exchanges-section">
      <Container>
        <div className="section-header">
          <div className="section-line"></div>
          <p className="section-subtitle">
            Get Master, Agent & Admin Accounts
          </p>
          <h2 className="section-title">Premium Exchanges</h2>
          <p className="section-description">
            At 1MindExch we are providing all kind of Master & Super Master Accounts! Our sports betting exchange
            master accounts make your betting business easy.
          </p>
        </div>

        <Row className="mb-5">
          {exchanges.map((exchange, index) => (
            <Col lg={4} md={6} key={index} className="mb-4">
              <div className="exchange-card">
                <div className="exchange-header">
                  <div className="exchange-icon" style={{backgroundColor: exchange.color}}>
                    {exchange.icon}
                  </div>
                  <h5 className="exchange-name">{exchange.name}</h5>
                </div>
                
                <div className="account-types">
                  {exchange.accounts.map((account, idx) => (
                    <Badge key={idx} className="account-badge">
                      {account}
                    </Badge>
                  ))}
                </div>
                
                <div className="min-bet">
                  <span className="min-bet-label">Minimum Bet:</span>
                  <span className="min-bet-amount">PKR {exchange.minBet}</span>
                </div>
                
                <Button 
                  className="get-account-btn mt-3 w-100"
                  onClick={() => window.open('https://wa.me/923061823657?text=Hi, I want to get account for ' + exchange.name, '_blank')}
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  Get Account
                </Button>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center">
          <Button 
            className="btn-primary-custom px-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'SHOW LESS' : 'VIEW ALL'}
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default Exchanges;