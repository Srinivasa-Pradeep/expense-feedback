import React from 'react';
import { MdExitToApp } from "react-icons/md";
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../service/ThemeContext';
import './Navbar.css';

const NavBar = () => {
  const navigate = useNavigate(); 
  const { theme, toggleTheme } = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className='main-nav glass-panel'>
      <a href='/home' className="navbar-brand-text text-gradient">
        Reimburse Feedback
      </a>
      <ul className="menu">
        <li>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <BsSunFill className="theme-icon sun" /> : <BsMoonStarsFill className="theme-icon moon" />}
          </button>
        </li>
        <li>
          <button className='logout-button premium-btn' onClick={handleLogout}>
            <span>Logout</span>
            <MdExitToApp className="logout-icon" />
          </button>
        </li>
        <li className="welcome-msg">
          Hello, <span>{storedUser ? storedUser.firstName : "Guest"}</span>
        </li>
        <div className="nav-divider"></div>
        <li><a href='/policies' className="nav-link">Policies</a></li>
        <li><a href="/history" className="nav-link">History</a></li>
        <li><a href="/portal" className="nav-link">Feedback</a></li>
        <li><a href="/home" className="nav-link">Home</a></li>
      </ul>
    </nav>
  );
};

export default NavBar;
