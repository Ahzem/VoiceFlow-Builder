import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Vapi from '@vapi-ai/web';
import Button from '../components/common/Button.jsx';
import { VAPI_API_KEY } from '../utils/constants.js';

const CallApp = () => {
  const [searchParams] = useSearchParams();
  const [assistant, setAssistant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [callState, setCallState] = useState('idle'); // idle, connecting, active, ending
  const [callDuration, setCallDuration] = useState(0);
  const [vapiInstance, setVapiInstance] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const assistantId = searchParams.get('assistantId');
  const companyName = searchParams.get('companyName') || 'Your Company';

  useEffect(() => {
    // Debug: Check if API key is loaded
    console.log('VAPI API Key loaded:', VAPI_API_KEY ? 'Yes' : 'No');
    console.log('API Key length:', VAPI_API_KEY?.length || 0);
    console.log('API Key starts with:', VAPI_API_KEY?.substring(0, 8) + '...' || 'undefined');

    if (assistantId) {
      setAssistant({
        id: assistantId,
        name: searchParams.get('assistantName') || 'Voice Assistant',
        companyName: companyName,
        personality: searchParams.get('personality') || 'professional',
        language: searchParams.get('language') || 'en-US'
      });
      setLoading(false);

      // Initialize VAPI instance
      try {
        if (!VAPI_API_KEY || VAPI_API_KEY === 'your-vapi-api-key') {
          throw new Error('VAPI API key not configured. Please check your .env file.');
        }

        console.log('Initializing VAPI with key...');
        const vapi = new Vapi(VAPI_API_KEY);
        setVapiInstance(vapi);

        // Set up event listeners
        vapi.on('call-start', () => {
          console.log('Call started');
          setCallState('active');
          setCallDuration(0);
        });

        vapi.on('call-end', () => {
          console.log('Call ended');
          setCallState('idle');
          setCallDuration(0);
        });

        vapi.on('speech-start', () => {
          console.log('Assistant started speaking');
        });

        vapi.on('speech-end', () => {
          console.log('Assistant stopped speaking');
        });

        vapi.on('volume-level', (volume) => {
          setVolumeLevel(volume);
        });

        vapi.on('error', (error) => {
          console.error('VAPI Error:', error);
          let errorMessage = 'Call failed';
          
          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.status === 401) {
            errorMessage = 'Authentication failed. Please check your VAPI API key.';
          } else if (error?.status === 403) {
            errorMessage = 'Access denied. Please verify your VAPI account permissions.';
          } else if (error?.status === 404) {
            errorMessage = 'Assistant not found. Please check the assistant ID.';
          }
          
          setError(errorMessage);
          setCallState('idle');
        });

        vapi.on('message', (message) => {
          console.log('VAPI Message:', message);
        });

        console.log('VAPI initialized successfully');

      } catch (error) {
        console.error('Failed to initialize VAPI:', error);
        setError('Failed to initialize voice system: ' + error.message);
      }
    } else {
      setError('No assistant ID provided');
      setLoading(false);
    }
  }, [assistantId, companyName, searchParams]);

  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    if (!vapiInstance || !assistantId) {
      setError('Voice system not ready');
      return;
    }

    try {
      setCallState('connecting');
      setError('');
      
      console.log('Starting call with assistant ID:', assistantId);
      console.log('Using VAPI key:', VAPI_API_KEY?.substring(0, 8) + '...');
      
      // Start the call with the assistant ID
      const call = await vapiInstance.start(assistantId);
      console.log('Call started successfully:', call);
      
    } catch (error) {
      console.error('Error starting call:', error);
      
      let errorMessage = 'Failed to start call';
      if (error?.message?.includes('401') || error?.status === 401) {
        errorMessage = 'Authentication failed. Your VAPI API key may be invalid or expired.';
      } else if (error?.message?.includes('403') || error?.status === 403) {
        errorMessage = 'Access denied. Please check your VAPI account permissions.';
      } else if (error?.message?.includes('404') || error?.status === 404) {
        errorMessage = 'Assistant not found. Please verify the assistant ID exists in your VAPI dashboard.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setCallState('idle');
    }
  };

  const handleEndCall = () => {
    if (vapiInstance && callState !== 'idle') {
      setCallState('ending');
      vapiInstance.stop();
    }
  };

  const handleToggleMute = () => {
    if (vapiInstance) {
      const newMutedState = !isMuted;
      vapiInstance.setMuted(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  const handleBackToHome = () => {
    if (callState === 'active') {
      handleEndCall();
    }
    window.location.href = '/';
  };

  const getCallStatusText = () => {
    switch (callState) {
      case 'connecting':
        return 'Connecting...';
      case 'active':
        return 'Call Active';
      case 'ending':
        return 'Ending Call...';
      default:
        return 'Ready to Call';
    }
  };

  const getCallStatusClass = () => {
    switch (callState) {
      case 'connecting':
        return 'connecting';
      case 'active':
        return 'active';
      case 'ending':
        return 'ending';
      default:
        return 'inactive';
    }
  };

  // SVG Icons
  const PhoneIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );

  const MicrophoneIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );

  const MicrophoneOffIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12L9 9z"/>
      <path d="M12 2a3 3 0 0 1 3 3v7M19 10v2a7 7 0 0 1-.11 1.23"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );

  const VolumeIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  );

  const ArrowLeftIcon = ({ className = "", size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12,19 5,12 12,5"/>
    </svg>
  );

  const CheckIcon = ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );

  if (loading) {
    return (
      <div className="call-app">
        <div className="container">
          <div className="call-container">
            <div className="loading-state">
              <div className="spinner-large"></div>
              <h2>Loading your assistant...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="call-app">
        <div className="container">
          <div className="call-container">
            <div className="error-state">
              <h2>Connection Error</h2>
              <p>{error}</p>
              {error.includes('API key') && (
                <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'rgba(49, 130, 206, 0.1)', borderRadius: 'var(--radius-md)' }}>
                  <h4>Troubleshooting Steps:</h4>
                  <ul style={{ textAlign: 'left', marginTop: 'var(--spacing-sm)' }}>
                    <li>Verify your VAPI API key in the .env file</li>
                    <li>Make sure you're using your <strong>Public Key</strong>, not Private Key</li>
                    <li>Check that your VAPI account is active</li>
                    <li>Restart the development server after changing .env</li>
                  </ul>
                </div>
              )}
              <Button onClick={handleBackToHome} variant="primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="call-app">
      <div className="container">
        <div className="call-container">
          {/* Header */}
          <div className="call-header">
            <div className="assistant-info">
              <h1>{assistant.name}</h1>
              <p className="company-name">{assistant.companyName}</p>
              <div className="assistant-details">
                <span className="detail-badge">{assistant.personality}</span>
                <span className="detail-badge">{assistant.language}</span>
              </div>
            </div>
            <Button 
              onClick={handleBackToHome} 
              variant="secondary"
              className="back-button"
              disabled={callState === 'connecting'}
            >
              <ArrowLeftIcon size={18} />
              Back to Home
            </Button>
          </div>

          {/* Call Interface */}
          <div className="call-interface">
            <div className="call-status">
              <div className={`status-indicator ${getCallStatusClass()}`}>
                {(callState === 'connecting' || callState === 'ending') && (
                  <div className="spinner"></div>
                )}
                {callState === 'active' && <div className="pulse-dot"></div>}
                <span>{getCallStatusText()}</span>
              </div>
              {callState === 'active' && (
                <div className="call-timer">{formatDuration(callDuration)}</div>
              )}
            </div>

            {/* Voice Animation */}
            <div className="voice-animation">
              <div className={`voice-circle voice-circle-1 ${callState === 'active' ? 'active' : ''}`}></div>
              <div className={`voice-circle voice-circle-2 ${callState === 'active' ? 'active' : ''}`}></div>
              <div className={`voice-circle voice-circle-3 ${callState === 'active' ? 'active' : ''}`}></div>
              <div className={`microphone-icon ${callState === 'active' ? 'active' : ''}`}>
                {callState === 'active' ? 
                  <MicrophoneIcon size={48} /> : 
                  <PhoneIcon size={48} />
                }
              </div>
              
              {/* Volume Level Indicator */}
              {callState === 'active' && volumeLevel > 0 && (
                <div className="volume-indicator">
                  <VolumeIcon size={16} className="volume-icon" />
                  <div className="volume-bars">
                    <div className={`volume-bar ${volumeLevel > 0.2 ? 'active' : ''}`}></div>
                    <div className={`volume-bar ${volumeLevel > 0.4 ? 'active' : ''}`}></div>
                    <div className={`volume-bar ${volumeLevel > 0.6 ? 'active' : ''}`}></div>
                    <div className={`volume-bar ${volumeLevel > 0.8 ? 'active' : ''}`}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="call-controls">
              {callState === 'idle' ? (
                <Button 
                  onClick={handleStartCall}
                  variant="success"
                  className="call-button start-call"
                  size="lg"
                >
                  <PhoneIcon size={20} />
                  Start Call
                </Button>
              ) : callState === 'connecting' ? (
                <Button 
                  variant="primary"
                  className="call-button connecting"
                  size="lg"
                  disabled
                >
                  <div className="spinner"></div>
                  Connecting...
                </Button>
              ) : callState === 'ending' ? (
                <Button 
                  variant="secondary"
                  className="call-button ending"
                  size="lg"
                  disabled
                >
                  <div className="spinner"></div>
                  Ending Call...
                </Button>
              ) : (
                <div className="active-call-controls">
                  <Button 
                    onClick={handleToggleMute}
                    variant={isMuted ? "warning" : "secondary"}
                    className="mute-button"
                    size="md"
                  >
                    {isMuted ? <MicrophoneOffIcon size={18} /> : <MicrophoneIcon size={18} />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                  <Button 
                    onClick={handleEndCall}
                    className="call-button end-call"
                    size="lg"
                    style={{
                      background: 'linear-gradient(135deg, #e53e3e, #c53030)',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    <PhoneIcon size={20} />
                    End Call
                  </Button>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="call-instructions">
              <h3>How to use your voice assistant:</h3>
              <ul>
                <li><CheckIcon />Click "Start Call" to begin your conversation</li>
                <li><CheckIcon />Speak naturally and clearly</li>
                <li><CheckIcon />Your assistant will respond based on your business configuration</li>
                <li><CheckIcon />Use the mute button if you need privacy during the call</li>
                <li><CheckIcon />Click "End Call" when you're finished</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallApp; 