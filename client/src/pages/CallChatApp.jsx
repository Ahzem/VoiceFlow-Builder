import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { VAPI_API_KEY, VAPI_PUBLIC_KEY } from '../utils/constants.js';
import Vapi from '@vapi-ai/web';

const CallChatApp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mode state
  const [activeMode, setActiveMode] = useState('chat');
  
  // Session management - following VAPI docs
  const [sessionId, setSessionId] = useState(null);
  const [sessionCreated, setSessionCreated] = useState(false);
  
  // Chat states
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  
  // Call states
  const [callState, setCallState] = useState('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [vapiInstance, setVapiInstance] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const assistantId = searchParams.get('assistantId');
  const companyName = searchParams.get('companyName') || 'Your Company';
  const initialMode = searchParams.get('mode') || 'chat';

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // Initialize assistant and create session
  useEffect(() => {
    if (assistantId) {
      setActiveMode(initialMode);
      setAssistant({
        id: assistantId,
        name: searchParams.get('assistantName') || 'AI Assistant',
        companyName: companyName,
        personality: searchParams.get('personality') || 'professional',
        language: searchParams.get('language') || 'en-US'
      });
      
      // Create session for this assistant
      createSession();
      
      // Initialize VAPI for calls
      initializeVAPI();
      
      setLoading(false);
    } else {
      setError('No assistant ID provided');
      setLoading(false);
    }
  }, [assistantId, companyName, searchParams, initialMode]);

  // Create session following VAPI docs
  const createSession = async () => {
    try {
      console.log('Creating session for assistant:', assistantId);
      
      const response = await fetch('https://api.vapi.ai/session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assistantId })
      });

      if (!response.ok) {
        throw new Error(`Session creation failed: ${response.status}`);
      }

      const session = await response.json();
      console.log('Session created:', session);
      
      setSessionId(session.id);
      setSessionCreated(true);
      
      // Add welcome message
      const welcomeMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI assistant for ${companyName}. I'll remember our conversation throughout this session. How can I help you today?`,
        timestamp: new Date().toISOString(),
        source: 'system'
      };
      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('Failed to create session:', error);
      setError(`Failed to create session: ${error.message}`);
    }
  };

  // Initialize VAPI for calls
  const initializeVAPI = async () => {
    try {
      if (!VAPI_PUBLIC_KEY || VAPI_PUBLIC_KEY === 'your-vapi-public-key') {
        console.warn('VAPI Public Key not configured properly');
        return;
      }

      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      setVapiInstance(vapi);

      // VAPI event listeners
      vapi.on('message', (message) => {
        console.log('VAPI Message:', message);
        
        if (message.type === 'transcript') {
          const transcriptMessage = {
            id: `voice-${Date.now()}`,
            role: message.role,
            content: message.transcript,
            timestamp: new Date().toISOString(),
            source: 'voice'
          };
          
          setMessages(prev => [...prev, transcriptMessage]);
        }
      });

      vapi.on('error', (error) => {
        console.error('VAPI Error:', error);
        setError(`Voice call error: ${error.message || 'Unknown error'}`);
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

    } catch (err) {
      console.error('Failed to initialize VAPI:', err);
      setError(`Failed to initialize voice service: ${err.message}`);
    }
  };

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callState === 'active') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Send chat message using sessionId (following VAPI docs)
  const sendChatMessage = async (message) => {
    if (!sessionId) {
      throw new Error('No session available');
    }

    try {
      const response = await fetch('https://api.vapi.ai/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: sessionId, // Using sessionId as per docs - no assistantId needed
          input: message,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  };

  // Handle streaming response following VAPI docs
  const handleStreamingResponse = async (response) => {
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let fullContent = '';

    setIsTyping(true);
    setStreamingMessage('');

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));
              
              // Following VAPI docs - look for path and delta
              if (event.path && event.delta) {
                fullContent += event.delta;
                setStreamingMessage(fullContent);
              }
            } catch (parseError) {
              console.error('Error parsing SSE event:', parseError);
            }
          }
        }
      }
    } finally {
      setIsTyping(false);
      setStreamingMessage('');
    }

    // Add complete message
    if (fullContent) {
      const newMessage = {
        id: `chat-${Date.now()}`,
        role: 'assistant',
        content: fullContent,
        timestamp: new Date().toISOString(),
        source: 'chat'
      };
      setMessages(prev => [...prev, newMessage]);
    }

    return fullContent;
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending || !sessionCreated) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      source: 'chat'
    };

    setMessages(prev => [...prev, userMessage]);
    
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await sendChatMessage(messageToSend);
      await handleStreamingResponse(response);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(`Failed to send message: ${error.message}`);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
        source: 'chat'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Markdown formatting
  const formatMessage = (content) => {
    if (!content) return '';
    
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Call functions
  const handleStartCall = async () => {
    if (!vapiInstance) {
      setError('Voice service not initialized');
      return;
    }

    try {
      setCallState('connecting');
      await vapiInstance.start(assistantId);
    } catch (error) {
      console.error('Error starting call:', error);
      setError(`Failed to start call: ${error.message}`);
      setCallState('idle');
    }
  };

  const handleEndCall = () => {
    if (vapiInstance && callState === 'active') {
      setCallState('ending');
      vapiInstance.stop();
    }
  };

  const handleToggleMute = () => {
    if (vapiInstance) {
      vapiInstance.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Utility functions
  const handleBackToHome = () => {
    navigate('/');
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Icons
  const MessageIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  );

  const PhoneIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
    </svg>
  );

  const SendIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );

  const ArrowLeftIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  );

  const UserIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
  );

  const BotIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
    </svg>
  );

  const MicrophoneIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );

  const MicrophoneOffIcon = ({ className = "", size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <line x1="1" y1="1" x2="23" y2="23"/>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12L9 9z"/>
      <path d="M15 9.34V5a3 3 0 0 0-5.94-.6"/>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2"/>
      <path d="M15 11v1a3 3 0 0 1-.12.35"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  );

  if (loading) {
    return (
      <div className="callchat-app">
        <div className="container">
          <div className="callchat-container">
            <div className="loading-state">
              <div className="spinner-large"></div>
              <h2>Loading your assistant...</h2>
              <p>Creating session...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !assistant) {
    return (
      <div className="callchat-app">
        <div className="container">
          <div className="callchat-container">
            <div className="error-state">
              <h2>Connection Error</h2>
              <p>{error}</p>
              
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
    <div className="callchat-app">
      <div className="container">
        <div className="callchat-container">
          {/* Header */}
          <div className="callchat-header">
            <div className="assistant-info">
              <h1>{assistant.name}</h1>
              <p className="company-name">{assistant.companyName}</p>
              <div className="assistant-details">
                <span className="detail-badge">{assistant.personality}</span>
                <span className="detail-badge">Session Active</span>
                <span className="detail-badge">
                  {activeMode === 'chat' ? <MessageIcon size={14} /> : <PhoneIcon size={14} />}
                  {activeMode === 'chat' ? 'Chat Mode' : 'Call Mode'}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleBackToHome} 
              variant="secondary"
              className="back-button"
            >
              <ArrowLeftIcon size={18} />
              Back to Home
            </Button>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <Button
              variant={activeMode === 'chat' ? 'primary' : 'secondary'}
              onClick={() => setActiveMode('chat')}
              className="mode-button"
            >
              <MessageIcon size={18} />
              Chat
            </Button>
            <Button
              variant={activeMode === 'call' ? 'primary' : 'secondary'}
              onClick={() => setActiveMode('call')}
              className="mode-button"
            >
              <PhoneIcon size={18} />
              Call
            </Button>
          </div>

          {/* Chat Interface */}
          {activeMode === 'chat' && (
            <div className="chat-interface">
              <div className="messages-container">
                <div className="messages-list">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`message ${message.role} ${message.isError ? 'error' : ''} ${message.source === 'voice' ? 'voice-source' : ''}`}
                    >
                      <div className="message-avatar">
                        {message.role === 'user' ? (
                          <UserIcon size={20} />
                        ) : (
                          <BotIcon size={20} />
                        )}
                      </div>
                      <div className="message-content">
                        <div 
                          className="message-text"
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        <div className="message-meta">
                          <span className="message-timestamp">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          {message.source === 'voice' && (
                            <span className="message-source">📞 Voice</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Streaming message */}
                  {isTyping && streamingMessage && (
                    <div className="message assistant streaming">
                      <div className="message-avatar">
                        <BotIcon size={20} />
                      </div>
                      <div className="message-content">
                        <div 
                          className="message-text"
                          dangerouslySetInnerHTML={{ __html: formatMessage(streamingMessage) }}
                        />
                        <div className="typing-indicator">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Typing indicator */}
                  {isTyping && !streamingMessage && (
                    <div className="message assistant typing">
                      <div className="message-avatar">
                        <BotIcon size={20} />
                      </div>
                      <div className="message-content">
                        <div className="typing-indicator">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="chat-input-container">
                {error && (
                  <div className="chat-error">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="error-dismiss">×</button>
                  </div>
                )}
                
                <div className="chat-input-wrapper">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={sessionCreated ? "Type your message... (supports **bold**, *italic*, `code`)" : "Creating session..."}
                    className="chat-input"
                    disabled={isSending || !sessionCreated}
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isSending || !sessionCreated}
                    variant="primary"
                    className="send-button"
                  >
                    {isSending ? (
                      <div className="spinner-small"></div>
                    ) : (
                      <SendIcon size={20} />
                    )}
                  </Button>
                </div>
                
                <div className="chat-help">
                  Press Enter to send • Session memory enabled • Supports markdown
                </div>
              </div>
            </div>
          )}

          {/* Call Interface */}
          {activeMode === 'call' && (
            <div className="call-interface">
              <div className="call-status">
                <div className={`status-indicator ${callState}`}>
                  {(callState === 'connecting' || callState === 'ending') && (
                    <div className="spinner"></div>
                  )}
                  {callState === 'active' && <div className="pulse-dot"></div>}
                  <span>{callState === 'idle' ? 'Ready to Call' : 
                           callState === 'connecting' ? 'Connecting...' :
                           callState === 'active' ? 'Call Active' : 'Ending Call...'}</span>
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
                  <MicrophoneIcon size={48} />
                </div>
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
            </div>
          )}

          {/* Session Stats */}
          <div className="app-stats">
            <div className="stat-item">
              <span className="stat-label">Session:</span>
              <span className="stat-value">{sessionCreated ? 'Active' : 'Creating...'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Messages:</span>
              <span className="stat-value">{messages.filter(m => m.source === 'chat').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mode:</span>
              <span className="stat-value">{activeMode}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Session ID:</span>
              <span className="stat-value">{sessionId ? sessionId.slice(0, 8) + '...' : 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallChatApp; 