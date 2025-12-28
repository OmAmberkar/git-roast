import React, { useState, useRef } from 'react';
import './roastForm.css'; // Import the CSS file
import { motion, AnimatePresence } from 'framer-motion'

const RoastForm = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [roastData, setRoastData] = useState(null);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [view, setView] = useState('input');

  const bgAudioRef = useRef(null);
  const thinkingAudioRef = useRef(null);

  const initAudio = () => {
    if (!bgAudioRef.current) {
      bgAudioRef.current = new Audio('/audio/background sound.mp3');
      bgAudioRef.current.volume = 0.5;
      bgAudioRef.current.loop = true;
      bgAudioRef.current.play().catch(e => console.log("Audio waiting for interaction..."));
    }

    if (!thinkingAudioRef.current) {
      thinkingAudioRef.current = new Audio('/audio/cyber-10071.mp3');
      thinkingAudioRef.current.volume = 0.4;
      thinkingAudioRef.current.loop = true;
    }
  };

  const playClick = () => {
    const audio = new Audio('/audio/button click 1.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => { });
  };

  const playSuccess = () => {
    const audio = new Audio('/audio/aggressive-tech-cyber-logo-452884.mp3');
    audio.volume = 0.6;
    audio.play().catch(() => { });
  };

  const playError = () => {
    const audio = new Audio('/audio/button click 2.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => { });
  };

  const switchToThinkingMode = () => {
    if (bgAudioRef.current) bgAudioRef.current.pause();
    if (thinkingAudioRef.current) {
      thinkingAudioRef.current.currentTime = 0;
      thinkingAudioRef.current.play().catch(() => { });
    }
  };

  const switchToNormalMode = () => {
    if (thinkingAudioRef.current) {
      thinkingAudioRef.current.pause();
      thinkingAudioRef.current.currentTime = 0;
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.play().catch(() => { });
    }
  };

  const handleRoast = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    playClick();
    setLoading(true);
    switchToThinkingMode();

    setError(null);
    setErrorCode(null);
    setRoastData(null);

    window.dispatchEvent(new CustomEvent('toggle-glitch', { detail: { active: true } }));

    try {
      const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8001';
      const response = await fetch(`${apiUrl}/api/roast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      if (!response.ok) {
        setErrorCode(response.status);
        const errorData = await response.json().catch(() => ({}));
        const detail = errorData.detail || 'UNKNOWN_DESTRUCTION_ERROR';

        switch (response.status) {
          case 404: throw new Error("I can't roast what I can't see. Is this repo private?");
          case 403: throw new Error('GitHub is tired of my insults. Rate limit hit.');
          case 422: throw new Error("This repo is empty or boring. Give me some CODE to destroy.");
          case 503: throw new Error("SETUP REQUIRED: Change the API Key in server/.env");
          case 502: throw new Error("GitHub's servers are cringing too hard at your repo.");
          default: throw new Error(detail);
        }
      }

      const data = await response.json();

      if (!data || !data.roast) {
        throw new Error("Received empty roast from server.");
      }

      setRoastData(data);
      setView('result');

      switchToNormalMode();
      playSuccess();

    } catch (err) {
      setError(err.message);
      switchToNormalMode();
      playError();
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('toggle-glitch', { detail: { active: false } }));
    }
  };

  return (
    <div className={`roast-container ${loading ? 'loading' : ''}`}>
      {loading && (
        <div className="loading-overlay">
          <div className="glitch-scanner"></div>
          <motion.div className="brain-melting-center" animate={{
            x: [0, -4, 4, -2, 2, 0],
            y: [0, 3, -3, 2, -2, 0],
          }}
            transition={{
              duration: 0.18,
              repeat: Infinity,
            }}>
            <motion.h2
              className="overload-text glitch-text"
              data-text="NEURAL_OVERLOAD_DETECTED"
              animate={{
                opacity: [1, 0.85, 1],
                skewX: [0, -6, 6, 0],
              }}
              transition={{
                duration: 0.25,
                repeat: Infinity,
              }}
            >
              NEURAL_OVERLOAD_DETECTED
            </motion.h2>
            <div className="symptoms">
              <span>SYMPTOMS: CONFUSION, NAUSEA, DISGUST</span>
              <span>ACTION: BYPASSING_LIMITS.exe</span>
              <span className="critical">BRAIN_CELLS_REMAINING: 0.003%</span>
              <span>PROCESSING_LEVEL_OF_LAMENESS: 11/10</span>
            </div>
            <div className="loading-bar">
              <div className="loading-fill"></div>
            </div>
          </motion.div>
          <div className="noise-canvas"></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            key={view}
            className={`main-content ${view}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {view === 'input' ? (
              <div className="input-wrapper">
                <div className="terminal-box">
                  <div className="terminal-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot cyan"></span>
                    <span className="title">git-roast --bash</span>
                  </div>

                  <form onSubmit={handleRoast} className="terminal-form">
                    <div className="input-row">
                      <span className="prompt">root@git-roast:~$</span>
                      <input
                        id="repo-url"
                        name="repo-url"
                        type="text"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        onFocus={initAudio}
                        onClick={initAudio}
                        placeholder="inject_repo_url_here..."
                        disabled={loading}
                        autoFocus
                      />
                      {!repoUrl && <span className="blink-cursor">_</span>}
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading || !repoUrl}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? 'CALCULATING_DESTRUCTION...' : 'EXECUTE_ROAST.sh'}
                    </motion.button>
                  </form>

                  {error && (
                    <div className="error-box">
                      <p>» ERROR: {error}</p>
                      <p>SYSTEM_STABILITY: CRITICAL</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="result-wrapper">
                <div className="result-box">
                  <div className="result-header">
                    <div className="recording">rec</div>
                    <h2>DESTRUCTION_DASHBOARD</h2>
                    <button onClick={() => setView('input')}>REBOOT_SYSTEM</button>
                  </div>
                  <div className="result-body">
                    <div className="roast-display">
                      <div className="header-label">TRANSCRIPTION_OF_SHAME</div>
                      <div className="roast-text">
                        "{roastData.roast}"
                      </div>
                    </div>
                    <div className="stats-display">
                      <div className="stat">
                        <div>LAMENESS_PERCENTAGE</div>
                        <div className="stat-value">{roastData.score}%</div>
                        <div className="stat-bar">
                          <div className="stat-fill" style={{ width: `${roastData.score}%` }}></div>
                        </div>
                      </div>
                      <div className="stat">
                        <div>AI_BRAIN_DAMAGE</div>
                        <div className="stat-value">CRITICAL</div>
                      </div>
                    </div>
                  </div>
                  <div className="data-stream">
                    DATA_STREAM: [INFO] FETCHING REPO CONTENT... [SUCCESS] PARSING CODE... [WARN] LAME CODE DETECTED... [CRITICAL] GENAI OVERLOAD... [DONE] ROAST GENERATED
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoastForm;
