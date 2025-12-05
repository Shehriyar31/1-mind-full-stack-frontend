import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useAutoLogout = (timeout = 300000) => { // 5 minutes = 300000ms
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      const adminLoggedIn = localStorage.getItem('adminLoggedIn');
      
      if (userLoggedIn || adminLoggedIn) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('adminLoggedIn');
        toast.warning('Session expired due to inactivity. Please login again.');
        navigate('/Users/Login');
      }
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimeoutHandler = () => resetTimeout();
    
    // Set initial timeout
    resetTimeout();
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimeoutHandler, true);
    });
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimeoutHandler, true);
      });
    };
  }, [timeout, navigate]);
};

export default useAutoLogout;