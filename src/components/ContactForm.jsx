import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    exchange: '',
    accountType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exchanges = [
    'Bpexch.net', 'Bpexch24.com', 'Bpexch.pro', 'Punjabexch.com', 'Betpro.me',
    'Lgexch.live', 'Lgexch.net', 'Bmaxexch.com', 'Fastbet.live', 'Betmax.gold',
    'Ukexchanges.com', 'Bmax.gold', 'Fi9exch.com', 'Mamaexch.com', 'Mamaexch.net',
    'Bestbet9.com', 'Bestbet9.net', 'Bestbet9.live', 'Lotusbook.io', 'Our777.com',
    'Mony777.com', 'Champbet9.com', 'Tjexch.com', 'Bestbook7.com', '1obet.com',
    'Champexch.com', 'Ppexch.com', 'Silverexch.com', 'Uniquexch.net', 'Tenexch.com',
    'Bajiexch.com', 'Unexch.live', 'Wingexch666.com', 'Lotusbook247.com', 'Betbhai9.red',
    'Goldexch.live', 'Goldenexch.com', 'Raisexch.com', 'Abexch.xyz', 'Abexch99.io'
  ];

  const accountTypes = [
    'Super Admin', 'Admin', 'Super Master', 'Master', 'Client Id'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'whatsapp') {
      // Only allow numbers and limit to 11 digits
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 11) {
        setFormData({
          ...formData,
          [name]: numericValue
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate WhatsApp number
    if (!formData.whatsapp.startsWith('03') || formData.whatsapp.length !== 11) {
      toast.error('❌ WhatsApp number must start with 03 and be exactly 11 digits!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Send email using EmailJS
      await emailjs.send(
        'service_jatuzbb',  // Your service ID
        'template_qm92b1a', // Your template ID
        {
          from_name: formData.name,
          whatsapp_number: formData.whatsapp,
          exchange: formData.exchange,
          account_type: formData.accountType,
          to_email: 'muhammadshehriyar31@gmail.com'
        },
        'nE6EN-lvKAnch6V6p' // Your public key
      );

      toast.success('✅ Message sent successfully! We will contact you soon.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form
      setFormData({
        name: '',
        whatsapp: '',
        exchange: '',
        accountType: ''
      });

    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('❌ Failed to send message. Please try again or contact us via WhatsApp.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <Container>
        <div className="section-header">
          <div className="section-line"></div>
          <p className="section-subtitle">
            Get Your Account Today
          </p>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-description">
            Fill out the form below and we'll get back to you with your account details
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="contact-form-card">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="contact-label">
                        <i className="bi bi-person me-2"></i>
                        Full Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="contact-input"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        required
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="contact-label">
                        <i className="bi bi-whatsapp me-2"></i>
                        WhatsApp Number
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        placeholder="03xxxxxxxxx"
                        className="contact-input"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        pattern="03[0-9]{9}"
                        maxLength="11"
                        title="WhatsApp number must start with 03 and be 11 digits"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="contact-label">
                        <i className="bi bi-globe me-2"></i>
                        Select Exchange
                      </Form.Label>
                      <Form.Select
                        name="exchange"
                        value={formData.exchange}
                        onChange={handleChange}
                        className="contact-input"
                        autoComplete="off"
                        required
                      >
                        <option value="">Choose Exchange...</option>
                        {exchanges.map((exchange, index) => (
                          <option key={index} value={exchange}>{exchange}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="contact-label">
                        <i className="bi bi-person-badge me-2"></i>
                        Account Type
                      </Form.Label>
                      <Form.Select
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        className="contact-input"
                        autoComplete="off"
                        required
                      >
                        <option value="">Choose Account Type...</option>
                        {accountTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button 
                    type="submit" 
                    className="contact-submit-btn"
                    disabled={isSubmitting}
                  >
                    <i className={`bi ${isSubmitting ? 'bi-hourglass-split' : 'bi-envelope'} me-2`}></i>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ContactForm;