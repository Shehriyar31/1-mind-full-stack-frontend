function WhatsAppFloat() {
  return (
    <div className="whatsapp-float">
      <a 
        href="https://wa.me/923061823657?text=Hi, I need help with 1MindExch services"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
      >
        <i className="bi bi-whatsapp"></i>
        <div className="whatsapp-tooltip">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="message-text">Need help? Chat with us!</div>
        </div>
      </a>
    </div>
  );
}

export default WhatsAppFloat;