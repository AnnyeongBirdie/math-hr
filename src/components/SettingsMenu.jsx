import React, {useRef, useState} from "react";

function SettingsMenu({
  onNewProblem,
  onResetScore,
  playClick,
  gearIcon,
  onChangeDifficulty,
  onToggleSound,
  isSoundOn,
  currentDifficulty,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function handleEventCommon(e,run) {
    // Only preventDefault for mouse events, not touch events
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    e.stopPropagation();
    if (!canPerformAction()) return false;
    playClick();
    run();
  }
  const lastActionTimeRef = useRef(0);

  const canPerformAction = () => {
    const now = Date.now();
    const delta = now - lastActionTimeRef.current;
    if (delta < 500) {
      return false;
    }
    lastActionTimeRef.current = now;
    return true;
  };

   const toggleModal = (e) => {
    handleEventCommon(e,()=>{
      setIsOpen(prev => !prev);
      setConfirmReset(false);
    });
  };

  const handleAction = (action, e) => {
    handleEventCommon(e,()=> {
      action();
      setIsOpen(false);
      setConfirmReset(false);
    });
  };

  const confirmResetAction = (e) => {
    handleEventCommon(e,()=> {
      setConfirmReset(true);
    });
  };

  const cancelReset = (e) => {
    handleEventCommon(e,()=> {
      setConfirmReset(false);
    });
  };

  const handleDifficultyChange = (level, e) => {
    handleEventCommon(e,()=> {
      onChangeDifficulty(level);
    });
  };

  const handleSoundToggle = (e) => {
    handleEventCommon(e,()=> {
      onToggleSound();
    });
  };

  const handleCloseModal = (e) => {
    handleEventCommon(e,()=> {
      setIsOpen(false);
      setConfirmReset(false);
    });
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      callback(e);
    }
  };

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