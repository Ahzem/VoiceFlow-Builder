import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Vapi from '@vapi-ai/web';
import Button from '../components/common/Button.jsx';
import { VAPI_PUBLIC_KEY } from '../utils/constants.js';

const CallApp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [callState, setCallState] = useState('idle'); // idle, connecting, active, ending
  const [callDuration, setCallDuration] = useState(0);
  const [vapiInstance, setVapiInstance] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [microphoneStatus, setMicrophoneStatus] = useState('unknown'); // unknown, granted, denied, unavailable

  const assistantId = searchParams.get('assistantId');
  const companyName = searchParams.get('companyName') || 'Your Company';

  // Check microphone permissions on component mount
  useEffect(() => {
    const checkMicrophonePermissions = async () => {
      try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMicrophoneStatus('unavailable');
          setError('Microphone access not supported in this browser');
          return;
        }

        // Check current permission status
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const permission = await navigator.permissions.query({ name: 'microphone' });
            console.log('Microphone permission status:', permission.state);
            
            if (permission.state === 'granted') {
              setMicrophoneStatus('granted');
            } else if (permission.state === 'denied') {
              setMicrophoneStatus('denied');
              setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
            } else {
              setMicrophoneStatus('prompt');
            }
          } catch (permErr) {
            console.log('Permission API not available, will try direct access');
            setMicrophoneStatus('unknown');
          }
        }

        // Try to access microphone to verify it works
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          console.log('Microphone test successful');
          setMicrophoneStatus('granted');
          // Stop the test stream
          stream.getTracks().forEach(track => track.stop());
        } catch (mediaErr) {
          console.error('Microphone test failed:', mediaErr);
          if (mediaErr.name === 'NotAllowedError') {
            setMicrophoneStatus('denied');
            setError('Microphone access denied. Please click the microphone icon in your browser address bar and allow microphone access.');
          } else if (mediaErr.name === 'NotFoundError') {
            setMicrophoneStatus('unavailable');
            setError('No microphone found. Please connect a microphone and try again.');
          } else {
            setMicrophoneStatus('error');
            setError(`Microphone error: ${mediaErr.message}`);
          }
        }
      } catch (err) {
        console.error('Error checking microphone:', err);
        setMicrophoneStatus('error');
        setError('Unable to check microphone status');
      }
    };

    checkMicrophonePermissions();
  }, []);

  useEffect(() => {
    // Enhanced debug: Check if Public API key is loaded
    console.log('=== VAPI Configuration Debug ===');
    console.log('VAPI Public Key loaded:', VAPI_PUBLIC_KEY ? 'Yes' : 'No');
    console.log('Public Key length:', VAPI_PUBLIC_KEY?.length || 0);
    console.log('Public Key starts with:', VAPI_PUBLIC_KEY?.substring(0, 8) + '...' || 'undefined');
    console.log('Is using fallback key:', VAPI_PUBLIC_KEY === '2588f020-c27b-4f60-8425-c47f4954174b');
    
    // Check environment variables
    console.log('Environment variables:');
    console.log('- VITE_VAPI_PUBLIC_KEY set:', !!import.meta.env.VITE_VAPI_PUBLIC_KEY);
    console.log('- VITE_VAPI_PUBLIC_KEY value length:', import.meta.env.VITE_VAPI_PUBLIC_KEY?.length || 0);
    console.log('- VITE_VAPI_PRIVATE_KEY set:', !!import.meta.env.VITE_VAPI_PRIVATE_KEY);
    console.log('- All env vars:', Object.keys(import.meta.env).filter(key => key.includes('VAPI')));

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
        if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === 'your-vapi-public-key') {
          throw new Error('VAPI Public Key not configured. Please check your .env file and ensure VITE_VAPI_PUBLIC_KEY is set.');
        }

        console.log('Initializing VAPI with public key...');
        const vapi = new Vapi(VAPI_PUBLIC_KEY);
        setVapiInstance(vapi);

        // Set up event listeners
        vapi.on('message', (message) => {
          console.log('VAPI Message:', message);
          
          if (message.type === 'transcript') {
            console.log(`${message.role}: ${message.transcript}`);
          } else if (message.type === 'speech-update') {
            if (message.status === 'started') {
              console.log('Assistant started speaking');
            } else if (message.status === 'stopped') {
              console.log('Assistant stopped speaking');
            }
          }
        });

        vapi.on('error', (error) => {
          console.error('VAPI Error:', error);
          console.error('Error details:', {
            message: error?.message,
            status: error?.status,
            response: error?.response,
            type: error?.type
          });
          
          // Enhanced error handling for different types of errors
          let errorMessage = 'Unknown error occurred';
          if (error?.status === 400) {
            errorMessage = 'Bad Request: The assistant ID may be invalid or the assistant is not properly configured';
          } else if (error?.status === 401) {
            errorMessage = 'Authentication failed: Invalid API key';
          } else if (error?.status === 403) {
            errorMessage = 'Access forbidden: Check your API key permissions';
          } else if (error?.status === 404) {
            errorMessage = 'Assistant not found: The assistant ID may be incorrect';
          } else if (error?.type === 'cors') {
            errorMessage = 'Network error: CORS or connection issue';
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          setError(`Voice call error: ${errorMessage}`);
          setCallState('idle');
        });

        vapi.on('call-start', () => {
          console.log('Call started');
          setCallState('active');
          setError('');
        });

        vapi.on('call-end', () => {
          console.log('Call ended');
          setCallState('idle');
          setCallDuration(0);
        });

        vapi.on('volume-level', (level) => {
          setVolumeLevel(level);
        });

        console.log('VAPI initialized successfully');
      } catch (err) {
        console.error('Failed to initialize VAPI:', err);
        setError(`Failed to initialize voice service: ${err.message}`);
        setLoading(false);
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
    if (!vapiInstance) {
      setError('Voice service not initialized');
      return;
    }

    // Check microphone before starting call
    if (microphoneStatus === 'denied') {
      setError('Microphone access is required for voice calls. Please enable microphone permissions and refresh the page.');
      return;
    }

    if (microphoneStatus === 'unavailable') {
      setError('No microphone detected. Please connect a microphone and try again.');
      return;
    }

    try {
      setCallState('connecting');
      setError('');
      
      console.log('Starting call with assistant ID:', assistantId);
      console.log('Using VAPI public key:', VAPI_PUBLIC_KEY?.substring(0, 8) + '...');
      
      // Additional debugging for assistant configuration
      console.log('Assistant configuration:', {
        id: assistantId,
        name: assistant?.name,
        companyName: companyName,
        personality: assistant?.personality,
        language: assistant?.language
      });
      
      // Test microphone one more time before call
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('Microphone access confirmed');
        stream.getTracks().forEach(track => track.stop());
      } catch (micErr) {
        console.error('Microphone access failed before call:', micErr);
        setError('Microphone access failed. Please check your browser permissions.');
        setCallState('idle');
        return;
      }
      
      console.log('Attempting to start VAPI call...');
      const call = await vapiInstance.start(assistantId);
      
      console.log('Call started successfully:', call);
    } catch (err) {
      console.error('Failed to start call:', err);
      setError(`Failed to start call: ${err.message || 'Unknown error'}`);
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
    navigate('/');
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

  // Render microphone permission warning if needed
  const renderMicrophoneWarning = () => {
    if (microphoneStatus === 'denied') {
      return (
        <div className="microphone-warning error">
          <div className="warning-icon">🎤</div>
          <div className="warning-content">
            <h4>Microphone Access Required</h4>
            <p>To make voice calls, please:</p>
            <ol>
              <li>Click the microphone icon in your browser's address bar</li>
              <li>Select "Allow" for microphone access</li>
              <li>Refresh this page</li>
            </ol>
          </div>
        </div>
      );
    }

    if (microphoneStatus === 'unavailable') {
      return (
        <div className="microphone-warning error">
          <div className="warning-icon">🎤</div>
          <div className="warning-content">
            <h4>No Microphone Detected</h4>
            <p>Please connect a microphone to your device and refresh the page.</p>
          </div>
        </div>
      );
    }

    if (microphoneStatus === 'error') {
      return (
        <div className="microphone-warning warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>Microphone Setup Issue</h4>
            <p>There may be an issue with your microphone setup. Please check your device settings.</p>
          </div>
        </div>
      );
    }

    return null;
  };

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
              
              {/* Enhanced troubleshooting for authentication errors */}
              {(error.includes('Authentication') || error.includes('401') || error.includes('API key')) && (
                <div style={{ 
                  marginTop: 'var(--spacing-lg)', 
                  padding: 'var(--spacing-lg)', 
                  background: 'rgba(49, 130, 206, 0.1)', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(49, 130, 206, 0.2)'
                }}>
                  <h4 style={{ color: 'var(--primary-vibrant-blue)', marginBottom: 'var(--spacing-md)' }}>
                    🔧 Authentication Fix
                  </h4>
                  
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <strong>Current Status:</strong>
                    <ul style={{ textAlign: 'left', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                      <li>Public Key Loaded: {VAPI_PUBLIC_KEY ? '✅ Yes' : '❌ No'}</li>
                      <li>Using Fallback Key: {VAPI_PUBLIC_KEY === '2588f020-c27b-4f60-8425-c47f4954174b' ? '⚠️ Yes' : '✅ No'}</li>
                      <li>Environment Configured: {import.meta.env.VITE_VAPI_PUBLIC_KEY ? '✅ Yes' : '❌ No'}</li>
                    </ul>
                  </div>
                  
                  <h4 style={{ color: 'var(--primary-vibrant-blue)', marginBottom: 'var(--spacing-sm)' }}>
                    Quick Fix Steps:
                  </h4>
                  <ol style={{ textAlign: 'left', marginTop: 'var(--spacing-sm)', fontSize: 'var(--font-size-sm)' }}>
                    <li>Create a <code>.env</code> file in the <code>client</code> directory</li>
                    <li>Add your VAPI Public Key: <code>VITE_VAPI_PUBLIC_KEY=your_public_key_here</code></li>
                    <li>Get your key from <a href="https://vapi.ai/dashboard" target="_blank" rel="noopener noreferrer">VAPI Dashboard</a></li>
                    <li>Restart the development server: <code>npm run dev</code></li>
                    <li>Refresh this page</li>
                  </ol>
                  
                  <div style={{ 
                    marginTop: 'var(--spacing-md)', 
                    padding: 'var(--spacing-sm)', 
                    background: 'rgba(237, 137, 54, 0.1)', 
                    borderRadius: 'var(--radius-sm)', 
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    <strong>⚠️ Important:</strong> Use your <strong>Public Key</strong> for calls, not the Private Key!
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                <Button onClick={handleBackToHome} variant="primary">
                  Back to Home
                </Button>
                <Button 
                  onClick={() => window.open('https://vapi.ai/dashboard', '_blank')} 
                  variant="secondary"
                >
                  Open VAPI Dashboard
                </Button>
              </div>
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
            {/* Microphone Warning */}
            {renderMicrophoneWarning()}

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

            {/* Configuration Status - for debugging */}
            <div className="config-status">
              <h4>Configuration Status</h4>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-label">Assistant ID:</div>
                  <div className="status-value">{assistantId}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">VAPI Public Key:</div>
                  <div className="status-value">
                    {VAPI_PUBLIC_KEY === '2588f020-c27b-4f60-8425-c47f4954174b' ? 
                      '⚠️ Using fallback key' : 
                      `✅ ${VAPI_PUBLIC_KEY?.substring(0, 8)}...`
                    }
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-label">Environment Key Set:</div>
                  <div className="status-value">
                    {import.meta.env.VITE_VAPI_PUBLIC_KEY ? 
                      `✅ ${import.meta.env.VITE_VAPI_PUBLIC_KEY.substring(0, 8)}...` : 
                      '❌ Not set'
                    }
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-label">Microphone:</div>
                  <div className="status-value">
                    {microphoneStatus === 'granted' && '✅ Ready'}
                    {microphoneStatus === 'denied' && '❌ Access denied'}
                    {microphoneStatus === 'unavailable' && '❌ Not found'}
                    {microphoneStatus === 'unknown' && '⚠️ Checking...'}
                    {microphoneStatus === 'error' && '❌ Error'}
                  </div>
                </div>
                <div className="status-item">
                  <div className="status-label">Call Ready:</div>
                  <div className="status-value">
                    {vapiInstance && microphoneStatus === 'granted' ? 
                      '✅ Ready' : 
                      '❌ Not ready'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallApp; 