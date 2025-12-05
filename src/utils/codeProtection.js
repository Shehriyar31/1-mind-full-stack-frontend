import { toast } from 'react-toastify';

let lastToastTime = 0;
const TOAST_DELAY = 1000; // 1 second delay between toasts

const showToast = (type, message) => {
  const now = Date.now();
  if (now - lastToastTime > TOAST_DELAY) {
    toast[type](`${message} | 1MINDEXCH`, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'professional-toast',
      bodyClassName: 'professional-toast-body'
    });
    lastToastTime = now;
  }
};

// DevTools Detection
let devToolsOpen = false;
let warningShown = false;

const detectDevTools = () => {
  const threshold = 160;
  if (window.outerHeight - window.innerHeight > threshold || 
      window.outerWidth - window.innerWidth > threshold) {
    if (!devToolsOpen) {
      devToolsOpen = true;
      if (!warningShown) {
        warningShown = true;
        document.body.innerHTML = `
          <div class="devtools-warning">
            <div>
              <h1><i class="bi bi-shield-x"></i> ACCESS DENIED</h1>
              <p>Developer Tools Detected!</p>
              <p>This action has been logged for security purposes.</p>
              <p style="color: #7928ca; font-weight: bold;">Protected by 1MINDEXCH</p>
              <button onclick="location.reload()" style="
                background: linear-gradient(45deg, #7928ca, #ff0080);
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 20px;
              ">Reload Page</button>
            </div>
          </div>
        `;
      }
    }
  } else {
    devToolsOpen = false;
  }
};

// Console Protection
const protectConsole = () => {
  console.clear();
  console.log('%c⚠ STOP!', 'color: red; font-size: 50px; font-weight: bold;');
  console.log('%c⚠ This is a browser feature intended for developers. Unauthorized access is prohibited!', 'color: red; font-size: 16px;');
  console.log('%c🔒 Protected by 1MINDEXCH - All rights reserved', 'color: #7928ca; font-size: 14px; font-weight: bold;');
};

export const initializeCodeProtection = () => {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showToast('error', 'Access Denied: Right-click functionality has been disabled for security purposes');
  });

  // Enhanced keyboard shortcuts blocking
  document.addEventListener('keydown', (e) => {
    // F12 - Developer Tools
    if (e.key === 'F12') {
      e.preventDefault();
      showToast('error', 'Security Alert: Developer tools access has been restricted');
    }
    
    // Ctrl+Shift+I - Developer Tools
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      showToast('error', 'Security Alert: Developer tools access has been denied');
    }
    
    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      showToast('error', 'Security Alert: Console access is not permitted');
    }
    
    // Ctrl+Shift+C - Element Inspector
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      showToast('error', 'Security Alert: Element inspector has been disabled');
    }
    
    // Ctrl+U - View Source
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      showToast('error', 'Security Alert: Source code viewing is not authorized');
    }
    
    // Ctrl+S - Save Page
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      showToast('warning', 'Notice: Page saving functionality has been disabled');
    }
    
    // Ctrl+A - Select All
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      showToast('warning', 'Notice: Content selection has been restricted');
    }
    
    // Ctrl+C - Copy
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      showToast('warning', 'Notice: Content copying is not permitted');
    }
    
    // Ctrl+P - Print
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      showToast('error', 'Security Alert: Printing functionality has been disabled');
    }
    
    // Ctrl+Shift+K - Firefox Console
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
      e.preventDefault();
      showToast('error', 'Security Alert: Console access is not authorized');
    }
    
    // Print Screen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      showToast('error', 'Security Alert: Screenshot capture is not allowed');
    }
  });

  // Disable text selection
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
  });

  // Disable drag and drop
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // Disable copy/paste/cut
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    showToast('warning', 'Notice: Content copying functionality has been disabled');
  });

  document.addEventListener('paste', (e) => {
    e.preventDefault();
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
  });

  // Disable print
  window.addEventListener('beforeprint', (e) => {
    e.preventDefault();
    showToast('error', 'Security Alert: Printing functionality is not available');
  });

  // Disable zoom
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
    }
  }, { passive: false });

  // Disable zoom keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
      e.preventDefault();
    }
  });

  // Start DevTools detection
  setInterval(detectDevTools, 500);
  
  // Protect console
  setInterval(protectConsole, 1000);
  
  // Prevent iframe embedding
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }
  
  // Initial console protection
  protectConsole();
  
  console.log('%c🔐 Website Protection Active - 1MINDEXCH', 'color: green; font-size: 16px; font-weight: bold;');
};