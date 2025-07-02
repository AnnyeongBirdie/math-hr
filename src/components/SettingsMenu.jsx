import React, { useState, useRef, useEffect } from "react";

function SettingsMenu({
  onNewProblem,
  onResetScore,
  clickSound,
  gearIcon,
  onChangeDifficulty,
  onToggleSound,
  isSoundOn,
  currentDifficulty,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const lastTouchedRef = useRef(0);
  const actionDebounceRef = useRef(0);
  const lastEventTypeRef = useRef(null); // Track the last event type

  const playSound = () => {
    if (clickSound && isSoundOn) {
      const audio = new Audio(clickSound);
      audio.currentTime = 0;
      audio.play();
    }
  };

  const canOpen = () => {
    const now = Date.now();
    if (now - lastTouchedRef.current > 400) {
      lastTouchedRef.current = now;
      return true;
    }
    return false;
  };

  // Enhanced debouncing with event type checking
  const canPerformAction = (actionName = "unknown", eventType = "unknown") => {
    const now = Date.now();
    const timeSinceLastAction = now - actionDebounceRef.current;
    
    console.log(`🔍 Action: ${actionName}, EventType: ${eventType}, Time since last: ${timeSinceLastAction}ms`);
    
    // If it's the same event type within a short time, allow it
    // If it's a different event type within a short time, block it (likely duplicate)
    if (timeSinceLastAction < 100) {
      if (lastEventTypeRef.current && lastEventTypeRef.current !== eventType) {
        console.log(`❌ Action ${actionName} BLOCKED (different event type too soon: ${lastEventTypeRef.current} -> ${eventType})`);
        return false;
      }
    }
    
    if (timeSinceLastAction > 300) {
      actionDebounceRef.current = now;
      lastEventTypeRef.current = eventType;
      console.log(`✅ Action ${actionName} ALLOWED`);
      return true;
    }
    
    console.log(`❌ Action ${actionName} BLOCKED (too soon)`);
    return false;
  };

  const toggleModal = (e) => {
    const eventType = e.type;
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canOpen()) return;
    playSound();
    setIsOpen(prev => !prev);
    setConfirmReset(false);
  };

  const handleAction = (action, e, actionName = "generic") => {
    const eventType = e.type;
    
    // Only preventDefault for mouse events, not touch events
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canPerformAction(actionName, eventType)) return;
    
    console.log(`🎯 Executing action: ${actionName}`);
    playSound();
    action();
    setIsOpen(false);
    setConfirmReset(false);
  };

  const confirmResetAction = (e) => {
    const eventType = e.type;
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canPerformAction("confirmReset", eventType)) return;
    
    playSound();
    setConfirmReset(true);
  };

  const cancelReset = (e) => {
    const eventType = e.type;
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canPerformAction("cancelReset", eventType)) return;
    
    playSound();
    setConfirmReset(false);
  };

  const handleDifficultyChange = (level, e) => {
    const eventType = e.type;
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canPerformAction(`difficulty-${level}`, eventType)) return;
    
    playSound();
    onChangeDifficulty(level);
  };

  const handleSoundToggle = (e) => {
    const eventType = e.type;
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canPerformAction("soundToggle", eventType)) return;
    
    console.log(`🔊 Sound toggle clicked. Current state: ${isSoundOn}`);
    playSound();
    onToggleSound();
    console.log(`🔊 Sound toggle after callback should be: ${!isSoundOn}`);
  };

  const handleCloseModal = (e) => {
    const eventType = e.type;
    if (eventType !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    
    if (!canPerformAction("closeModal", eventType)) return;
    
    playSound();
    setIsOpen(false);
    setConfirmReset(false);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      callback(e);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.className === "settings-modal-backdrop") {
        setIsOpen(false);
        setConfirmReset(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setConfirmReset(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      {/* Gear Icon */}
      <div style={{ position: "absolute", top: "20px", left: "70px", zIndex: 1000 }}>
        <img
          src={gearIcon}
          alt="Settings"
          role="button"
          tabIndex="0"
          onMouseDown={toggleModal}
          onTouchStart={toggleModal}
          onKeyDown={(e) => handleKeyDown(e, toggleModal)}
          style={{
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="settings-modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "20px",
              width: "90%",
              maxWidth: "350px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              textAlign: "center",
              animation: "fadeIn 0.2s ease-in-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>⚙️ 설정</h3>

            {/* New Problem */}
            <div
              role="button"
              tabIndex="0"
              onMouseDown={(e) => handleAction(onNewProblem, e, "newProblem")}
              onTouchStart={(e) => handleAction(onNewProblem, e, "newProblem")}
              onKeyDown={(e) => handleKeyDown(e, (e) => handleAction(onNewProblem, e, "newProblem"))}
              style={menuItemStyle()}
            >
              🔄 새 문제
            </div>

            {/* Reset Score with Confirm */}
            {confirmReset ? (
              <>
                <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button 
                    onMouseDown={(e) => handleAction(onResetScore, e, "resetScore")} 
                    onTouchStart={(e) => handleAction(onResetScore, e, "resetScore")}
                    onKeyDown={(e) => handleKeyDown(e, (e) => handleAction(onResetScore, e, "resetScore"))}
                    style={buttonStyle("danger")}
                  >
                    네
                  </button>
                  <button 
                    onMouseDown={cancelReset} 
                    onTouchStart={cancelReset}
                    onKeyDown={(e) => handleKeyDown(e, cancelReset)}
                    style={buttonStyle("cancel")}
                  >
                    아니요
                  </button>
                </div>
              </>
            ) : (
              <div
                role="button"
                tabIndex="0"
                onMouseDown={confirmResetAction}
                onTouchStart={confirmResetAction}
                onKeyDown={(e) => handleKeyDown(e, confirmResetAction)}
                style={menuItemStyle("#fce4e4")}
              >
                🧹 점수 초기화
              </div>
            )}

            {/* Sound Toggle */}
            <div
              role="button"
              tabIndex="0"
              onMouseDown={handleSoundToggle}
              onTouchStart={handleSoundToggle}
              onKeyDown={(e) => handleKeyDown(e, handleSoundToggle)}
              style={menuItemStyle()}
            >
              🔊 소리 {isSoundOn ? "끄기" : "켜기"}
            </div>

            {/* Difficulty Levels */}
            <div style={{ marginTop: "15px" }}>
              <strong>난이도 설정</strong>
              <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "10px" }}>
                {["쉬움", "보통", "어려움"].map((level) => (
                  <button
                    key={level}
                    onMouseDown={(e) => handleDifficultyChange(level, e)}
                    onTouchStart={(e) => handleDifficultyChange(level, e)}
                    onKeyDown={(e) => handleKeyDown(e, (e) => handleDifficultyChange(level, e))}
                    style={{
                      ...buttonStyle("neutral"),
                      backgroundColor: currentDifficulty === level ? "#a3d9a5" : "#f0f0f0",
                      border: currentDifficulty === level ? "2px solid #27ae60" : "1px solid #ddd",
                      fontWeight: currentDifficulty === level ? "bold" : "normal",
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onMouseDown={handleCloseModal}
              onTouchStart={handleCloseModal}
              onKeyDown={(e) => handleKeyDown(e, handleCloseModal)}
              style={{ marginTop: "20px", ...buttonStyle("cancel") }}
            >
              닫기
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

// --- Styles ---
const menuItemStyle = (bg = "#f0f0f0") => ({
  margin: "10px 0",
  padding: "10px",
  backgroundColor: bg,
  borderRadius: "6px",
  cursor: "pointer",
});

const buttonStyle = (type = "neutral") => {
  const colors = {
    danger: "#f66",
    cancel: "#ccc",
    neutral: "#f0f0f0",
  };
  return {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    backgroundColor: colors[type],
    cursor: "pointer",
  };
};

export default SettingsMenu;