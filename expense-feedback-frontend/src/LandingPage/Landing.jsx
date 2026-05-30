import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from '../service/ThemeContext';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated"));
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="main2-container">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradient"></div>
      
      <header className="landing-header">
        <div className="logo-container">
          <a href="/home" className="landing-logo-text text-gradient">
            Reimburse Feedback
          </a>
        </div>
        <div className="button-container">
          <a href="/policies" className="landing-nav-link">Policies</a>
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <BsSunFill className="theme-icon sun" /> : <BsMoonStarsFill className="theme-icon moon" />}
          </button>
          {!isAuthenticated ? (
            <button className="premium-btn outline-btn" onClick={() => navigate('/login')}>Sign in</button>
          ) : (
            <button className="premium-btn outline-btn" onClick={() => navigate('/portal')}>Feedback Generator</button>
          )}
        </div>
      </header>

      <main className="landing-main">
        <div className="inside glass-panel">
          <div className="info-container">
            {user && user.firstName && (
              <p className="hello-message">Hey, <span>{user.firstName}</span></p>
            )}
            <h1 className="heading text-gradient">
              Precision Expense Auditing.<br />
              Intelligent Compliance.
            </h1>
            <p className="sub-content">
              Instantly verify reimbursement claims against corporate policies. Leverage local Retrieval-Augmented Generation (RAG) to analyze receipts, flag discrepancies, and accelerate financial audits with absolute accuracy.
            </p>
            <div className="button-container-start">
              <button className="premium-btn get-started-btn" onClick={() => navigate('/portal')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
