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

  const toggleModal = () => {
    if (!canOpen()) return;
    playSound();
    setIsOpen(prev => !prev);
    setConfirmReset(false);
  };

  const handleAction = (action) => {
    playSound();
    action();
    setIsOpen(false);
    setConfirmReset(false);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(action);
    }
  };

  const confirmResetAction = () => {
    playSound();
    setConfirmReset(true);
  };

  const cancelReset = () => {
    playSound();
    setConfirmReset(false);
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
      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1000 }}>
        <img
          src={gearIcon}
          alt="Settings"
          role="button"
          tabIndex="0"
          onMouseDown={toggleModal}
          onTouchStart={toggleModal}
          onKeyDown={(e) =>
            e.key === "Enter" || e.key === " " ? toggleModal() : null
          }
          style={{
            width: "32px",
            height: "32px",
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
          >
            <h3 style={{ marginTop: 0 }}>⚙️ 설정</h3>

            {/* New Problem */}
            <div
              role="button"
              tabIndex="0"
              onMouseDown={() => handleAction(onNewProblem)}
              onTouchStart={() => handleAction(onNewProblem)}
              onKeyDown={(e) => handleKeyDown(e, onNewProblem)}
              style={menuItemStyle()}
            >
              🔄 새 문제
            </div>

            {/* Reset Score with Confirm */}
            {confirmReset ? (
              <>
                <div style={{ marginTop: "10px", fontWeight: "bold" }}>정말로 점수를 초기화할까요?</div>
                <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button onClick={() => handleAction(onResetScore)} style={buttonStyle("danger")}>네</button>
                  <button onClick={cancelReset} style={buttonStyle("cancel")}>아니요</button>
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
              onMouseDown={() => handleAction(onToggleSound)}
              onTouchStart={() => handleAction(onToggleSound)}
              onKeyDown={(e) => handleKeyDown(e, onToggleSound)}
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
                    onClick={() => handleAction(() => onChangeDifficulty(level))}
                    style={{
                      ...buttonStyle("neutral"),
                      backgroundColor: currentDifficulty === level ? "#a3d9a5" : "#f0f0f0",
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                playSound();
                setIsOpen(false);
                setConfirmReset(false);
              }}
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
    border: "none",
    backgroundColor: colors[type],
    cursor: "pointer",
  };
};

export default SettingsMenu;
