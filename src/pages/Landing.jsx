import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';

const Landing = () => {
  const navigate = useNavigate();
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - in real app, this would come from API/localStorage
  useEffect(() => {
    // Simulate loading assistants from storage or API
    const savedAssistants = JSON.parse(localStorage.getItem('voiceflow_assistants') || '[]');
    
    // Add some demo assistants if none exist
    if (savedAssistants.length === 0) {
      const demoAssistants = [
        {
          id: 'demo-1',
          name: 'Customer Support Assistant',
          companyName: 'TechCorp Solutions',
          personality: 'professional',
          language: 'en-US',
          industry: 'Technology',
          status: 'active',
          createdAt: '2024-01-15',
          callsToday: 23,
          totalCalls: 156
        },
        {
          id: 'demo-2',
          name: 'Sales Assistant',
          companyName: 'Digital Marketing Pro',
          personality: 'friendly',
          language: 'en-US',
          industry: 'Marketing',
          status: 'active',
          createdAt: '2024-01-10',
          callsToday: 8,
          totalCalls: 89
        }
      ];
      setAssistants(demoAssistants);
    } else {
      setAssistants(savedAssistants);
    }
    
    setLoading(false);
  }, []);

  const handleGetStarted = () => {
    navigate('/wizard');
  };

  const handleCallAssistant = (assistant) => {
    const params = new URLSearchParams({
      assistantId: assistant.id,
      assistantName: assistant.name,
      companyName: assistant.companyName,
      personality: assistant.personality,
      language: assistant.language
    });
    navigate(`/call?${params.toString()}`);
  };

  const handleEditAssistant = (assistant) => {
    // Store assistant data for editing
    localStorage.setItem('editing_assistant', JSON.stringify(assistant));
    navigate('/wizard');
  };

  // SVG Icons
  const PhoneIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const EditIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const PlusIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );

  const BarChartIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  );

  const StatusIcon = ({ status, size = 12 }) => (
    <div className={`status-dot ${status}`} style={{ width: size, height: size }}></div>
  );

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <span className="logo-text">VoiceFlow Builder</span>
            </div>
            <nav className="header-nav">
              <Button variant="secondary" size="sm" onClick={handleGetStarted}>
                <PlusIcon size={16} />
                Create Assistant
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span>✨ No-Code Voice Assistant Platform</span>
            </div>
            <h1 className="hero-title">
              Build Intelligent Voice Assistants
              <span className="hero-accent"> in Minutes</span>
            </h1>
            <p className="hero-description">
              Create sophisticated AI-powered voice assistants for your business without any coding. 
              Integrate with Google Calendar, upload your knowledge base, and start engaging customers 
              through natural voice conversations.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Assistants Created</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Calls Handled</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="voice-animation">
              <div className="voice-circle voice-circle-1"></div>
              <div className="voice-circle voice-circle-2"></div>
              <div className="voice-circle voice-circle-3"></div>
              <div className="microphone-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Assistants Dashboard */}
        {assistants.length > 0 && (
          <section className="assistants-section">
            <div className="section-header">
              <div className="header-content">
                <h2>Your Voice Assistants</h2>
                <p>Manage and test your created assistants</p>
              </div>
              <Button variant="primary" onClick={handleGetStarted}>
                <PlusIcon size={18} />
                Create New Assistant
              </Button>
            </div>

            {loading ? (
              <div className="loading-grid">
                {[1, 2, 3].map(i => (
                  <div key={i} className="assistant-card skeleton">
                    <div className="skeleton-header"></div>
                    <div className="skeleton-content"></div>
                    <div className="skeleton-footer"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="assistants-grid">
                {assistants.map((assistant) => (
                  <div key={assistant.id} className="assistant-card">
                    <div className="card-header">
                      <div className="assistant-info">
                        <h3 className="assistant-name">{assistant.name}</h3>
                        <p className="company-name">{assistant.companyName}</p>
                      </div>
                      <div className="assistant-status">
                        <StatusIcon status={assistant.status} />
                        <span className="status-text">{assistant.status}</span>
                      </div>
                    </div>

                    <div className="card-content">
                      <div className="assistant-details">
                        <div className="detail-row">
                          <span className="detail-label">Industry:</span>
                          <span className="detail-value">{assistant.industry}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Language:</span>
                          <span className="detail-value">{assistant.language}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Personality:</span>
                          <span className="detail-value">{assistant.personality}</span>
                        </div>
                      </div>

                      <div className="assistant-stats">
                        <div className="stat-card">
                          <div className="stat-icon">
                            <BarChartIcon size={16} />
                          </div>
                          <div className="stat-info">
                            <div className="stat-number">{assistant.callsToday}</div>
                            <div className="stat-label">Today</div>
                          </div>
                        </div>
                        <div className="stat-card">
                          <div className="stat-icon">
                            <PhoneIcon size={16} />
                          </div>
                          <div className="stat-info">
                            <div className="stat-number">{assistant.totalCalls}</div>
                            <div className="stat-label">Total</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => handleEditAssistant(assistant)}
                        className="edit-btn"
                      >
                        <EditIcon size={16} />
                        Edit
                      </Button>
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleCallAssistant(assistant)}
                        className="call-btn"
                      >
                        <PhoneIcon size={16} />
                        Test Call
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Everything You Need for Voice AI</h2>
            <p>Professional-grade features designed for modern businesses</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>No-Code Builder</h3>
              <p>Create sophisticated voice assistants without any technical knowledge. Our intuitive interface guides you through every step.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3>Smart Scheduling</h3>
              <p>Seamlessly integrate with Google Calendar for intelligent appointment booking and availability management.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3>Knowledge Base</h3>
              <p>Upload your business documents, FAQs, and policies. Your assistant will use this information to provide accurate responses.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption and privacy controls ensure your business data remains secure and compliant.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3>Instant Deployment</h3>
              <p>Your voice assistant goes live immediately after setup. Start engaging with customers right away.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
              </div>
              <h3>Analytics & Insights</h3>
              <p>Track performance metrics, conversation analytics, and customer satisfaction to optimize your assistant.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Transform Your Customer Experience?</h2>
            <p>Join thousands of businesses using AI voice assistants to improve customer engagement and streamline operations.</p>
            <div className="cta-actions">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleGetStarted}
                className="cta-button"
              >
                <PlusIcon size={20} />
                Create Your First Assistant
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="demo-button"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing; 