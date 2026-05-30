import React, { useState } from "react";
import { FaUserAstronaut } from "react-icons/fa6";
import { TbShieldLockFilled } from "react-icons/tb";
import { useTheme } from '../service/ThemeContext';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/CostoSight.png';
import { IoMdCloseCircle } from "react-icons/io";
import './RegisterForm.css';

const SuccessPopup = ({ onClose, show }) => (
  <div className={`success-popup ${show ? 'show' : ''} glass-panel`}>
    <p>User registered successfully!</p>
    <IoMdCloseCircle onClick={onClose} className="popup-close" />
  </div>
);

const ErrorPopup = ({ onClose, show }) => (
  <div className={`error-popup ${show ? 'show' : ''} glass-panel`}>
    <p>Check credentials again!</p>
    <IoMdCloseCircle onClick={onClose} className="popup-close" />
  </div>
);

const RegisterForm = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

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
      const response = await fetch("http://localhost:5002/user/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        setShowErrorPopup(true);
        throw new Error('Registration Failed!'); 
      }

      const result = await response.json();

      if (result.user && result.user._id) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setShowErrorPopup(true);
      }
    } catch (error) {
      setShowErrorPopup(true);
      console.error(error.message);
    }
  };

  return (
    <div className="overall-register-container">
      {/* Background Mesh Gradient */}
      <div className="mesh-gradient"></div>

      {/* Floating Theme Toggle */}
      <button className="theme-toggle-floating" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'dark' ? <BsSunFill className="theme-icon sun" /> : <BsMoonStarsFill className="theme-icon moon" />}
      </button>

      <div className="register-wrapper glass-panel">
        <form className="entryform" onSubmit={submit}>
          <img src={logo} alt="Logo" className="register-logo" />
          <h2 className="register-title">Create Account</h2>
          
          <div className="input-box">
            <input
              type='text'
              name="email"
              placeholder='Email ID'
              required
              value={formData.email}
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
              onChange={handleInputChange}
            />
            <TbShieldLockFilled className='FaIcon' />
          </div>

          <div className="input-row">
            <div className="input-box half">
              <input
                type='text'
                name="firstName"
                placeholder='First Name'
                required
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-box half">
              <input
                type='text'
                name="lastName"
                placeholder='Last Name'
                required
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button type='submit' className="premium-btn register-btn">
            Register
          </button>
          
          {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} show={showSuccessPopup} />}
          {showErrorPopup && <ErrorPopup onClose={() => setShowErrorPopup(false)} show={showErrorPopup} />}
          
          <div className="register-link">
            <p>Already Registered? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
