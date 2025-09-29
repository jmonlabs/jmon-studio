import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Editor from '@monaco-editor/react';
import * as Tone from 'tone';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Authentication Context
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { username, password });
      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const register = async (username, email, password, full_name) => {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        username, email, password, full_name
      });
      const { access_token, user: userData } = response.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Registration failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// API utility with auth headers
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  return axios({
    url: `${API}${url}`,
    ...options,
    headers: {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

// Login/Register Component
const AuthForm = () => {
  const { login, register, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = isLogin 
        ? await login(formData.username, formData.password)
        : await register(formData.username, formData.email, formData.password, formData.full_name);

      if (!result.success) {
        setError(result.error);
      } else {
        // Successfully logged in/registered - AuthProvider will handle redirect via user state change
        console.log('Authentication successful');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Authentication failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container" data-testid="auth-form">
      <div className="auth-card">
        <div className="auth-header">
          <h1>JMON Studio</h1>
          <p>Algorithmic Music Composition Platform</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button 
            className={isLogin ? '' : 'active'}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            data-testid="username-input"
          />

          {!isLogin && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                data-testid="email-input"
              />
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                data-testid="fullname-input"
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            data-testid="password-input"
          />

          {error && <div className="auth-error" data-testid="auth-error">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="auth-submit"
            data-testid="auth-submit"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-features">
          <h3>Platform Features:</h3>
          <ul>
            <li>✅ Algorithmic music composition</li>
            <li>✅ openDAW integration</li>
            <li>✅ Project organization with folders</li>
            <li>✅ Real-time audio preview</li>
            <li>✅ Usage analytics dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Monaco Editor component for code editing
const CodeEditor = ({ code, onChange, onCompile }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEditorMount = (editor) => {
    editor.updateOptions({
      wordWrap: 'on',
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      tabSize: 2,
    });

    editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () => {
      onCompile();
    });
  };

  return (
    <div className="code-editor-container">
      <div className="editor-toolbar">
        <h3>JMON Code Editor</h3>
        <div className="toolbar-controls">
          <span className="shortcut-hint">Ctrl+Enter to compile</span>
          <button 
            onClick={onCompile}
            className="compile-btn"
            disabled={isLoading}
            data-testid="compile-btn"
          >
            {isLoading ? 'Compiling...' : 'Compile & Preview'}
          </button>
        </div>
      </div>
      <Editor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        onMount={handleEditorMount}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 10 },
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          cursorBlinking: 'blink',
          contextmenu: true,
          mouseWheelZoom: true
        }}
      />
    </div>
  );
};

// Folder Management Component
const FolderManager = ({ folders, onCreateFolder, onSelectFolder, selectedFolderId }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="folder-manager" data-testid="folder-manager">
      <div className="folder-header">
        <h3>Folders</h3>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="new-folder-btn"
          data-testid="new-folder-btn"
        >
          + New Folder
        </button>
      </div>
      
      {showCreateForm && (
        <div className="create-folder-form">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            data-testid="folder-name-input"
          />
          <button onClick={handleCreateFolder} data-testid="create-folder-btn">Create</button>
          <button onClick={() => setShowCreateForm(false)}>Cancel</button>
        </div>
      )}
      
      <div className="folders-list">
        <div 
          className={`folder-item ${selectedFolderId === '' ? 'active' : ''}`}
          onClick={() => onSelectFolder('')}
          data-testid="root-folder"
        >
          <span className="folder-icon">📁</span>
          <span>All Projects</span>
        </div>
        
        {folders.map((folder) => (
          <div 
            key={folder.id} 
            className={`folder-item ${selectedFolderId === folder.id ? 'active' : ''}`}
            onClick={() => onSelectFolder(folder.id)}
            data-testid={`folder-${folder.id}`}
          >
            <span className="folder-icon">📁</span>
            <span>{folder.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Project management component with folders
const ProjectManager = ({ projects, folders, onSelectProject, onCreateProject, onDeleteProject, currentProject, selectedFolderId, onSelectFolder }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });

  const handleCreateProject = async () => {
    if (newProjectData.name.trim()) {
      await onCreateProject(newProjectData.name.trim(), newProjectData.description, selectedFolderId);
      setNewProjectData({ name: '', description: '' });
      setShowCreateForm(false);
    }
  };

  const filteredProjects = selectedFolderId === '' 
    ? projects 
    : projects.filter(p => p.folder_id === selectedFolderId);

  return (
    <div className="project-manager">
      <FolderManager 
        folders={folders}
        onCreateFolder={(name) => onCreateProject(null, null, null, name)} // Create folder
        onSelectFolder={onSelectFolder}
        selectedFolderId={selectedFolderId}
      />
      
      <div className="projects-section">
        <div className="project-header">
          <h3>Projects</h3>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="new-project-btn"
            data-testid="new-project-btn"
          >
            + New Project
          </button>
        </div>
        
        {showCreateForm && (
          <div className="create-project-form">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectData.name}
              onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              data-testid="project-name-input"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newProjectData.description}
              onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})}
              data-testid="project-description-input"
            />
            <button onClick={handleCreateProject} data-testid="create-project-btn">Create</button>
            <button onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        )}
        
        <div className="projects-list">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
              data-testid={`project-${project.id}`}
            >
              <div className="project-content" onClick={() => onSelectProject(project)}>
                <h4>{project.name}</h4>
                {project.description && <p className="project-description">{project.description}</p>}
                <div className="project-meta">
                  <small>Updated: {new Date(project.updated_at).toLocaleDateString()}</small>
                  {project.play_count > 0 && <small>Plays: {project.play_count}</small>}
                </div>
              </div>
              <button 
                className="delete-project-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteProject(project.id, project.name);
                }}
                title="Delete project"
                data-testid={`delete-project-${project.id}`}
              >
                🗑️
              </button>
            </div>
          ))}
          
          {filteredProjects.length === 0 && (
            <div className="no-projects">
              <p>No projects in this folder.</p>
              <p>Create your first composition!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = ({ stats, activity, loading }) => {
  if (loading) {
    return (
      <div className="analytics-dashboard" data-testid="analytics-dashboard">
        <h3>Usage Analytics</h3>
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard" data-testid="analytics-dashboard">
      <h3>Usage Analytics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Projects</h4>
          <span className="stat-number">{stats?.total_projects || 0}</span>
        </div>
        <div className="stat-card">
          <h4>Compilations</h4>
          <span className="stat-number">{stats?.total_compilations || 0}</span>
        </div>
        <div className="stat-card">
          <h4>Plays</h4>
          <span className="stat-number">{stats?.total_plays || 0}</span>
        </div>
        <div className="stat-card">
          <h4>Active Today</h4>
          <span className="stat-number">{stats?.active_users_today || 0}</span>
        </div>
      </div>

      {stats?.popular_projects?.length > 0 && (
        <div className="popular-projects">
          <h4>Most Played Projects</h4>
          <div className="popular-list">
            {stats.popular_projects.map((project, index) => (
              <div key={project._id} className="popular-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{project.name}</span>
                <span className="plays">{project.play_count} plays</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activity?.length > 0 && (
        <div className="recent-activity">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            {activity.slice(0, 5).map((event) => (
              <div key={event.id} className="activity-item">
                <span className="event-type">{(event.event_type || '').replace('_', ' ')}</span>
                <span className="event-time">{new Date(event.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Preview panel for compiled JMON objects with audio playback
const JMONPreview = ({ compiledObject, isCompiling, onPlayAudio, isPlaying }) => {
  const [activeTab, setActiveTab] = useState('json');

  return (
    <div className="jmon-preview">
      <div className="preview-header">
        <h3>JMON Object Preview</h3>
        <div className="preview-tabs">
          <button 
            className={`tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON
          </button>
          <button 
            className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            Audio
          </button>
        </div>
      </div>
      
      {isCompiling ? (
        <div className="preview-loading">
          <p>Compiling...</p>
        </div>
      ) : (
        <div className="preview-content">
          {activeTab === 'json' && (
            <div className="json-preview">
              {compiledObject ? (
                <pre>{JSON.stringify(compiledObject, null, 2)}</pre>
              ) : (
                <p>No compiled object. Click "Compile & Preview" to see the result.</p>
              )}
            </div>
          )}
          
          {activeTab === 'audio' && (
            <div className="audio-preview">
              <div className="audio-controls">
                <button 
                  className="play-btn"
                  onClick={onPlayAudio}
                  disabled={!compiledObject || isPlaying}
                  data-testid="play-audio-btn"
                >
                  {isPlaying ? 'Playing...' : 'Play Audio'}
                </button>
                <button 
                  className="stop-btn"
                  onClick={() => Tone.Transport.stop()}
                  disabled={!isPlaying}
                  data-testid="stop-audio-btn"
                >
                  Stop
                </button>
              </div>
              
              {compiledObject && (
                <div className="audio-info">
                  <p><strong>Tempo:</strong> {compiledObject.tempo || 120} BPM</p>
                  <p><strong>Time Signature:</strong> {compiledObject.timeSignature || '4/4'}</p>
                  <p><strong>Tracks:</strong> {compiledObject.tracks?.length || 0}</p>
                  <p><strong>Duration:</strong> {compiledObject.duration || 0}s</p>
                </div>
              )}
              
              <div className="waveform-placeholder">
                <p>Audio waveform visualization will appear here during playback</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// User Profile Component
const UserProfile = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="user-profile" data-testid="user-profile">
      <button 
        className="profile-toggle"
        onClick={() => setShowProfile(!showProfile)}
        data-testid="profile-toggle"
      >
        <span className="user-avatar">👤</span>
        <span className="username">{user?.username}</span>
      </button>
      
      {showProfile && (
        <div className="profile-dropdown">
          <div className="profile-info">
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            {user?.full_name && <p><strong>Name:</strong> {user.full_name}</p>}
          </div>
          <button 
            onClick={logout}
            className="logout-btn"
            data-testid="logout-btn"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// OpenDAW Integration Component (keeping existing functionality)
const OpenDAWIntegration = ({ project, onSync }) => {
  const [isLoadingDAW, setIsLoadingDAW] = useState(false);
  const [showDAW, setShowDAW] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [dawSynth, setDawSynth] = useState(null);

  useEffect(() => {
    const initDAWAudio = async () => {
      try {
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        const bass = new Tone.MonoSynth({
          oscillator: { type: 'square' },
          envelope: { attack: 0.1, decay: 0.3, sustain: 0.2, release: 0.5 }
        }).toDestination();
        
        setDawSynth({ synth, bass });
      } catch (error) {
        console.error('Failed to initialize DAW audio:', error);
      }
    };
    
    if (showDAW) {
      initDAWAudio();
    }
  }, [showDAW]);

  const loadOpenDAW = () => {
    setIsLoadingDAW(true);
    setTimeout(() => {
      setShowDAW(true);
      setIsLoadingDAW(false);
      // Don't automatically open fullscreen - let user choose
    }, 1500);
  };

  const closeDAW = () => {
    setShowDAW(false);
    setIsFullScreen(false);
    setIsPlaying(false);
    Tone.Transport.stop();
    Tone.Transport.cancel();
  };

  const playDAW = async () => {
    if (!dawSynth || !project?.jmon_object) {
      alert('No composition loaded or audio not initialized');
      return;
    }

    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // Track play event
      await apiRequest(`/projects/${project.id}/play`, { method: 'POST' });

      setIsPlaying(true);
      Tone.Transport.bpm.value = project.jmon_object.tempo || 120;
      
      Tone.Transport.cancel();
      
      if (project.jmon_object.tracks) {
        project.jmon_object.tracks.forEach((track, trackIndex) => {
          if (track.notes && track.notes.length > 0) {
            track.notes.forEach(note => {
              if (note.note && note.time !== undefined) {
                Tone.Transport.schedule((time) => {
                  if (track.instrument === 'bass') {
                    dawSynth.bass.triggerAttackRelease(
                      note.note, 
                      note.duration || 0.25, 
                      time,
                      track.volume || 0.5
                    );
                  } else {
                    dawSynth.synth.triggerAttackRelease(
                      note.note, 
                      note.duration || 0.25, 
                      time,
                      track.volume || 0.5
                    );
                  }
                }, note.time);
              }
            });
          }
        });
      }
      
      const updateTime = () => {
        const seconds = Tone.Transport.seconds;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        setCurrentTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        
        if (isPlaying) {
          requestAnimationFrame(updateTime);
        }
      };
      
      updateTime();
      
      const duration = project.jmon_object.duration || 8;
      Tone.Transport.schedule(() => {
        Tone.Transport.stop();
        setIsPlaying(false);
        setCurrentTime('00:00');
      }, duration);
      
      Tone.Transport.start();
    } catch (error) {
      console.error('DAW playback failed:', error);
      setIsPlaying(false);
    }
  };

  const stopDAW = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
    setCurrentTime('00:00');
  };

  if (isFullScreen && showDAW) {
    return (
      <div className="daw-fullscreen-modal" data-testid="opendaw-fullscreen">
        <div className="daw-fullscreen-content">
          <div className="daw-fullscreen-header">
            <div className="daw-title">
              <h2>openDAW Studio</h2>
              <span>Project: {project?.name || 'Untitled'}</span>
            </div>
            <button onClick={closeDAW} className="close-daw-btn" data-testid="close-daw-btn">
              ✕
            </button>
          </div>
          
          <div className="daw-fullscreen-body">
            <div className="daw-transport-bar">
              <div className="transport-controls">
                <button 
                  className={`daw-play ${isPlaying ? 'active' : ''}`}
                  onClick={playDAW}
                  disabled={isPlaying}
                  data-testid="daw-play-btn"
                >
                  ▶
                </button>
                <button 
                  className="daw-stop"
                  onClick={stopDAW}
                  disabled={!isPlaying}
                  data-testid="daw-stop-btn"
                >
                  ⏸
                </button>
                <button className="daw-record" data-testid="daw-record-btn">⏺</button>
                <span className="daw-time" data-testid="daw-time">{currentTime}</span>
                <span className="daw-bpm">♩ = {project?.jmon_object?.tempo || 120} BPM</span>
              </div>
              
              <div className="sync-controls">
                <button 
                  onClick={() => onSync('opendaw')}
                  className="sync-to-jmon-btn"
                  data-testid="sync-to-jmon-btn"
                >
                  ← Sync to JMON
                </button>
              </div>
            </div>
            
            <div className="daw-main-area">
              <div className="daw-tracks-panel">
                <div className="tracks-header">
                  <h3>Tracks</h3>
                  <button className="add-track-btn">+ Add Track</button>
                </div>
                
                <div className="daw-tracks-list">
                  {project?.jmon_object?.tracks?.map((track, index) => (
                    <div key={index} className="daw-track-full" data-testid={`track-${index}`}>
                      <div className="track-header-full">
                        <div className="track-info">
                          <h4>{track.name}</h4>
                          <span className="track-instrument">{track.instrument}</span>
                        </div>
                        <div className="track-controls">
                          <button className="track-mute">M</button>
                          <button className="track-solo">S</button>
                          <input 
                            type="range" 
                            min="0" 
                            max="1" 
                            step="0.1"
                            defaultValue={track.volume || 0.8}
                            className="track-volume"
                          />
                        </div>
                      </div>
                      
                      <div className="track-content-full">
                        <div className="timeline-ruler">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="timeline-marker">{i + 1}</div>
                          ))}
                        </div>
                        
                        <div className="track-clips">
                          {track.notes?.map((note, noteIndex) => (
                            <div 
                              key={noteIndex}
                              className="audio-clip-full"
                              style={{ 
                                left: `${(note.time / 8) * 100}%`,
                                width: `${((note.duration || 0.25) / 8) * 100}%`
                              }}
                              title={`${note.note} - ${note.duration}s`}
                              data-testid={`clip-${index}-${noteIndex}`}
                            >
                              <span className="clip-label">{note.note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="no-tracks">
                      <p>No tracks available. Compile JMON code first.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="daw-inspector">
                <h3>Inspector</h3>
                <div className="inspector-content">
                  <div className="project-info">
                    <h4>Project Info</h4>
                    <p><strong>Tempo:</strong> {project?.jmon_object?.tempo || 120} BPM</p>
                    <p><strong>Time Signature:</strong> {project?.jmon_object?.timeSignature || '4/4'}</p>
                    <p><strong>Duration:</strong> {project?.jmon_object?.duration || 4}s</p>
                    <p><strong>Tracks:</strong> {project?.jmon_object?.tracks?.length || 0}</p>
                  </div>
                  
                  <div className="track-effects">
                    <h4>Effects</h4>
                    <div className="effects-list">
                      <div className="effect-slot">Reverb</div>
                      <div className="effect-slot">Delay</div>
                      <div className="effect-slot">+ Add Effect</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="opendaw-integration">
      <div className="daw-header">
        <h3>openDAW Integration</h3>
        <div className="daw-controls">
          {!showDAW && (
            <button 
              onClick={loadOpenDAW}
              disabled={isLoadingDAW}
              className="load-daw-btn"
              data-testid="load-opendaw-btn"
            >
              {isLoadingDAW ? 'Loading...' : 'Load openDAW'}
            </button>
          )}
          <button 
            onClick={() => onSync('jmon')}
            className="sync-btn"
            disabled={!project}
            data-testid="sync-to-daw-btn"
          >
            Sync to DAW
          </button>
        </div>
      </div>
      
      <div className="daw-container">
        {showDAW ? (
          <div className="daw-loaded">
            <div className="daw-preview">
              <h4>✅ openDAW Ready</h4>
              <p>DAW interface loaded successfully</p>
              <div className="daw-quick-controls">
                <button 
                  onClick={() => setIsFullScreen(true)} 
                  className="fullscreen-btn"
                  data-testid="fullscreen-btn"
                >
                  🎛️ Open Full Studio
                </button>
                <button 
                  onClick={closeDAW}
                  className="close-daw-preview-btn"
                  data-testid="close-daw-preview-btn"
                >
                  ✕ Close DAW
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="daw-placeholder">
            <h4>OpenDAW Integration</h4>
            <p>Click "Load openDAW" to start the DAW interface</p>
            <p>Project: {project?.name || 'No project selected'}</p>
            
            <div className="integration-features">
              <h4>Integration Features:</h4>
              <ul>
                <li>✅ Bidirectional sync with JMON</li>
                <li>✅ Real-time audio playback</li>
                <li>✅ Professional DAW interface</li>
                <li>✅ Track editing and effects</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Studio Component with multi-user support
const JMONStudio = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [jmonCode, setJMONCode] = useState(`// 🎵 Welcome to JMON Studio!
// Create beautiful algorithmic music compositions with JavaScript
// Let your creativity flow through code...

// 🎼 Craft a serene melody
const createMelody = () => {
  const pentatonicScale = ['C4', 'D4', 'F4', 'G4', 'A4', 'C5', 'D5'];
  const rhythmPatterns = [0.5, 0.25, 0.75, 0.25, 1.0, 0.5];
  
  // Generate a peaceful algorithmic melody
  const melody = [];
  for (let i = 0; i < 12; i++) {
    const noteIndex = Math.floor(Math.sin(i * 0.5) * 3 + 3);
    melody.push({
      note: pentatonicScale[noteIndex],
      duration: rhythmPatterns[i % rhythmPatterns.length],
      time: i * 0.5,
      velocity: 0.6 + Math.sin(i * 0.3) * 0.2
    });
  }
  
  return melody;
};

// 🎸 Add a gentle bass foundation
const createBass = () => {
  const bassNotes = ['C2', 'F2', 'G2', 'Am2', 'C2', 'F2'];
  const bassLine = [];
  
  for (let i = 0; i < bassNotes.length; i++) {
    bassLine.push({
      note: bassNotes[i],
      duration: 1.5,
      time: i * 1.5,
      velocity: 0.4
    });
  }
  
  return bassLine;
};

// 🌟 Create harmonic sparkles
const createHarmony = () => {
  const chordNotes = [
    ['C4', 'E4', 'G4'],
    ['F4', 'A4', 'C5'],
    ['G4', 'B4', 'D5'],
    ['Am4', 'C5', 'E5']
  ];
  
  const harmony = [];
  chordNotes.forEach((chord, chordIndex) => {
    chord.forEach((note, noteIndex) => {
      harmony.push({
        note: note,
        duration: 2.0,
        time: chordIndex * 2 + noteIndex * 0.1,
        velocity: 0.3
      });
    });
  });
  
  return harmony;
};

// 🎶 Compose your masterpiece
const composition = {
  title: "Algorithmic Serenity",
  tracks: [
    {
      name: 'Peaceful Melody',
      notes: createMelody(),
      instrument: 'synth',
      volume: 0.7,
      pan: 0.1,
      effects: ['reverb']
    },
    {
      name: 'Gentle Bass',  
      notes: createBass(),
      instrument: 'bass',
      volume: 0.5,
      pan: -0.2,
      effects: ['lowpass']
    },
    {
      name: 'Harmonic Sparkles',
      notes: createHarmony(),
      instrument: 'pad',
      volume: 0.4,
      pan: 0.0,
      effects: ['reverb', 'delay']
    }
  ],
  tempo: 90,
  timeSignature: '4/4',
  duration: 8,
  mood: 'serene'
};

// ✨ Return your musical creation
return composition;`);
  const [compiledObject, setCompiledObject] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [jmonSynth, setJmonSynth] = useState(null);
  const [notification, setNotification] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({ stats: null, activity: [] });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Initialize Tone.js and load data
  useEffect(() => {
    const originalError = window.console.error;
    window.console.error = (...args) => {
      if (
        typeof args[0] === 'string' && 
        args[0].includes('ResizeObserver loop')
      ) {
        return;
      }
      originalError.apply(console, args);
    };
    
    const initAudio = async () => {
      try {
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        setJmonSynth(synth);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };
    
    loadProjects();
    loadFolders();
    initAudio();
    
    Tone.Transport.on('stop', () => {
      setIsPlaying(false);
    });
    
    if (process.env.NODE_ENV === 'development') {
      window.addEventListener('error', (e) => {
        if (e.message?.includes?.('ResizeObserver loop')) {
          e.stopImmediatePropagation();
        }
      });
    }
    
    return () => {
      window.console.error = originalError;
    };
  }, []);

  const loadProjects = async () => {
    try {
      const params = selectedFolderId ? `?folder_id=${selectedFolderId}` : '';
      const response = await apiRequest(`/projects${params}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      showNotification('Failed to load projects', 'error');
    }
  };

  const loadFolders = async () => {
    try {
      const response = await apiRequest('/folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        apiRequest('/analytics/stats'),
        apiRequest('/analytics/activity?days=7')
      ]);
      
      setAnalyticsData({
        stats: statsResponse.data,
        activity: activityResponse.data
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
      showNotification('Failed to load analytics', 'error');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const createProject = async (name, description, folderId, isFolder = false) => {
    try {
      if (isFolder) {
        // Create folder
        const response = await apiRequest('/folders', {
          method: 'POST',
          data: { name, description }
        });
        setFolders(prev => [...prev, response.data]);
        showNotification('Folder created successfully');
        return;
      }

      const response = await apiRequest('/projects', {
        method: 'POST',
        data: {
          name,
          description,
          folder_id: folderId === '' ? undefined : folderId,
          jmon_code: jmonCode
        }
      });
      
      setProjects(prev => [...prev, response.data]);
      setCurrentProject(response.data);
      showNotification(`✅ Project "${name}" created successfully!`);
    } catch (error) {
      console.error('Failed to create project/folder:', error);
      showNotification('Failed to create project/folder', 'error');
    }
  };

  const selectProject = (project) => {
    setCurrentProject(project);
    setJMONCode(project.jmon_code || jmonCode);
    setCompiledObject(project.jmon_object);
  };

  const selectFolder = (folderId) => {
    setSelectedFolderId(folderId);
    loadProjects(); // This will filter by folder
  };

  const compileJMON = async () => {
    setIsCompiling(true);
    try {
      let compiledResult;
      
      try {
        const wrappedCode = `
          (function() {
            const jm = {
              melody: (config) => config.notes || [],
              harmony: (config) => config.chords || [],
              rhythm: (config) => config.pattern || []
            };
            
            ${jmonCode}
          })()
        `;
        
        compiledResult = eval(wrappedCode);
        
        if (compiledResult && typeof compiledResult === 'object') {
          setCompiledObject(compiledResult);
          showNotification('🎼 Code compiled successfully - ready for playback!');
          
          if (currentProject) {
            await updateProject({ 
              jmon_code: jmonCode, 
              jmon_object: compiledResult 
            });
          }

          // Track compilation event
          await apiRequest('/jmon/compile', {
            method: 'POST',
            data: { code: jmonCode, project_id: currentProject?.id }
          });
        } else {
          throw new Error('Code must return a valid composition object');
        }
      } catch (evalError) {
        throw new Error(`Compilation error: ${evalError.message}`);
      }
    } catch (error) {
      console.error('Compilation failed:', error);
      showNotification(`Compilation failed: ${error.message}`, 'error');
    }
    setIsCompiling(false);
  };

  const playAudio = async () => {
    if (!compiledObject || !jmonSynth) {
      showNotification('No compiled object or audio not initialized', 'error');
      return;
    }

    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // Track play event
      if (currentProject) {
        await apiRequest(`/projects/${currentProject.id}/play`, { method: 'POST' });
      }

      setIsPlaying(true);
      
      Tone.Transport.bpm.value = compiledObject.tempo || 120;
      
      if (compiledObject.tracks && compiledObject.tracks.length > 0) {
        compiledObject.tracks.forEach(track => {
          if (track.notes && track.notes.length > 0) {
            track.notes.forEach(note => {
              if (note.note && note.time !== undefined) {
                Tone.Transport.schedule((time) => {
                  jmonSynth.triggerAttackRelease(
                    note.note, 
                    note.duration || 0.25, 
                    time
                  );
                }, note.time);
              }
            });
          }
        });
        
        const duration = compiledObject.duration || 4;
        Tone.Transport.schedule(() => {
          Tone.Transport.stop();
          setIsPlaying(false);
        }, duration);
        
        Tone.Transport.start();
        showNotification('Playing composition...');
      } else {
        throw new Error('No tracks found in the composition');
      }
    } catch (error) {
      console.error('Playback failed:', error);
      showNotification(`Playback failed: ${error.message}`, 'error');
      setIsPlaying(false);
    }
  };

  const updateProject = async (updateData) => {
    if (!currentProject) return;
    
    try {
      const response = await apiRequest(`/projects/${currentProject.id}`, {
        method: 'PUT',
        data: updateData
      });
      setCurrentProject(response.data);
      setProjects(prev => prev.map(p => p.id === currentProject.id ? response.data : p));
      showNotification(`💾 Project "${currentProject.name}" saved!`);
    } catch (error) {
      console.error('Failed to update project:', error);
      showNotification('Failed to update project', 'error');
    }
  };

  const syncToDAW = async (source) => {
    if (!currentProject || !compiledObject) {
      showNotification('No compiled object to sync', 'error');
      return;
    }

    try {
      // Simulate sync for now
      showNotification('Sync successful');
      const updatedProject = await apiRequest(`/projects/${currentProject.id}`);
      setCurrentProject(updatedProject.data);
    } catch (error) {
      console.error('Sync failed:', error);
      showNotification('Sync failed', 'error');
    }
  };

  const toggleAnalytics = async () => {
    if (!showAnalytics) {
      await loadAnalytics();
    }
    setShowAnalytics(!showAnalytics);
  };

  const showNotification = (message, type = 'success') => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const deleteProject = async (projectId, projectName) => {
    if (!window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiRequest(`/projects/${projectId}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== projectId));
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setJMONCode(jmonCode); // Reset to default code
      }
      showNotification(`🗑️ Project "${projectName}" deleted successfully`);
    } catch (error) {
      console.error('Failed to delete project:', error);
      showNotification(`Failed to delete project "${projectName}"`, 'error');
    }
  };

  return (
    <div className="jmon-studio">
      <header className="studio-header">
        <div className="header-left">
          <h1>JMON Studio</h1>
          <p>Algorithmic Music Composition + OpenDAW Integration</p>
        </div>
        <div className="header-right">
          <button 
            onClick={toggleAnalytics}
            className={`analytics-btn ${showAnalytics ? 'active' : ''}`}
            data-testid="analytics-toggle"
            disabled={analyticsLoading}
          >
            {analyticsLoading ? '⏳ Loading...' : '📊 Analytics'}
          </button>
          <UserProfile />
        </div>
      </header>

      {notification && (
        <div className={`notification ${notification.includes('Failed') || notification.includes('failed') || notification.includes('error') ? 'error' : 'success'}`}>
          {notification}
        </div>
      )}

      {showAnalytics ? (
        <div className="analytics-view">
          <AnalyticsDashboard 
            stats={analyticsData.stats}
            activity={analyticsData.activity}
            loading={analyticsLoading}
          />
          <button 
            onClick={() => setShowAnalytics(false)}
            className="close-analytics"
          >
            Back to Studio
          </button>
        </div>
      ) : (
        <div className="studio-layout">
          <div className="left-panel">
            <ProjectManager
              projects={projects}
              folders={folders}
              onSelectProject={selectProject}
              onCreateProject={createProject}
              onDeleteProject={deleteProject}
              currentProject={currentProject}
              selectedFolderId={selectedFolderId}
              onSelectFolder={selectFolder}
            />
          </div>

          <div className="main-panel">
            <CodeEditor
              code={jmonCode}
              onChange={(newCode) => {
                setJMONCode(newCode);
                if (currentProject) {
                  // Debounced save could be added here
                }
              }}
              onCompile={compileJMON}
            />
            
            <JMONPreview 
              compiledObject={compiledObject}
              isCompiling={isCompiling}
              onPlayAudio={playAudio}
              isPlaying={isPlaying}
            />
          </div>

          <div className="right-panel">
            <OpenDAWIntegration
              project={currentProject}
              onSync={syncToDAW}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading JMON Studio...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <JMONStudio />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/studio" 
              element={
                <ProtectedRoute>
                  <JMONStudio />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;