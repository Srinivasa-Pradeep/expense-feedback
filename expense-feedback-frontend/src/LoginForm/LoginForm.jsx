import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../service/ThemeContext';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { TbShieldLockFilled } from "react-icons/tb";
import { FaUserAstronaut } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";
import './LoginForm.css';

const SuccessPopup = ({ onClose, show }) => (
  <div className={`success-popup ${show ? 'show' : ''} glass-panel`}>
    <p>User logged in successfully!</p>
    <IoMdCloseCircle onClick={onClose} className="popup-close" />
  </div> 
);

const ErrorPopup = ({ onClose, show }) => (
  <div className={`error-popup ${show ? 'show' : ''} glass-panel`}>
    <p>Check credentials again!</p>
    <IoMdCloseCircle onClick={onClose} className="popup-close" />
  </div>
);

const LoginForm = () => {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const navigate = useNavigate(); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5002/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) { 
        setShowErrorPopup(true);
        throw new Error('Login failed'); 
      }

      const result = await response.json();

      if (result.user && result.user._id) {
        setShowErrorPopup(false);
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate('/home');
        }, 1000);

        const user = JSON.stringify(result.user);
        localStorage.setItem("user", user);
        localStorage.setItem("token", result.token);
        localStorage.setItem("isAuthenticated", result.isauthenticated); 
      } else {
        setShowSuccessPopup(false)
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error(error.message);
      setShowErrorPopup(true); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit(e); 
    }
  };

  return (
    <div className="overall-login-container">
      {/* Background Mesh Gradient */}
      <div className="mesh-gradient"></div>

      {/* Floating Theme Toggle */}
      <button className="theme-toggle-floating" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? <BsSunFill className="theme-icon sun" /> : <BsMoonStarsFill className="theme-icon moon" />}
      </button>

      <div className="login-wrapper glass-panel">
        <form className="entryform" onSubmit={submit}>
          <h1 className="login-logo-text text-gradient">Reimburse Feedback</h1>
          <h2 className="login-title">Sign In</h2>
          
          <div className="input-box">
            <input
              type='text'
              name="email"
              placeholder='Email ID'
              required
              value={formData.email}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
            />
            <FaUserAstronaut className='FaIcon' />
          </div>

          <div className="input-box">
            <input
              type='password'
              name="password"
              placeholder='Password'
              required
              value={formData.password}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
            />
            <TbShieldLockFilled className='FaIcon' />
          </div>

          <button type='button' className="premium-btn login-btn" onClick={submit}>
            Login
          </button>
          
          {showSuccessPopup && !showErrorPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} show={showSuccessPopup} />}
          {showErrorPopup && !showSuccessPopup && <ErrorPopup onClose={() => setShowErrorPopup(false)} show={showErrorPopup} />}
          
          <div className="register-link">
            <p>Haven't created an account? <Link to="/register">Register here</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
