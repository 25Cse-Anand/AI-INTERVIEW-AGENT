import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import DynamicInterview from './components/DynamicInterview';
import StructuredFeedback from './components/StructuredFeedback';

export default function App() {
  // Screens: 'landing' | 'login' | 'interview' | 'feedback'
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);

  const handleNavToLogin = () => {
    setScreen('login');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setScreen('interview');
  };

  const handleInterviewComplete = (feedback) => {
    setFeedbackData(feedback);
    setScreen('feedback');
  };

  const handleRestart = () => {
    setUser(null);
    setFeedbackData(null);
    setScreen('landing');
  };

  return (
    <div className="app-root">
      {screen === 'landing' && (
        <LandingPage
          onLoginClick={handleNavToLogin}
          onStartInterview={handleNavToLogin}
        />
      )}
      {screen === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      {screen === 'interview' && user && (
        <DynamicInterview
          user={user}
          onComplete={handleInterviewComplete}
        />
      )}
      {screen === 'feedback' && feedbackData && (
        <StructuredFeedback feedback={feedbackData} onRestart={handleRestart} />
      )}
    </div>
  );
}
