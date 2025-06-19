import React, { useState, useRef, useEffect } from "react";

function SettingsMenu({ onNewProblem, onResetScore, clickSound, gearIcon }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  let wasHandled = false;

  const playSound = () => {
    if (clickSound) {
      const audio = new Audio(clickSound);
      audio.currentTime = 0;
      audio.play();
    }
  };

  const handleToggle = () => {
    if (wasHandled) return;
    wasHandled = true;
    playSound();
    setIsOpen(prev => !prev);
    setTimeout(() => {
      wasHandled = false;
    }, 300);
  };

  const handleAction = (action) => {
    if (wasHandled) return;
    wasHandled = true;
    playSound();
    action();
    setIsOpen(false);
    setTimeout(() => {
      wasHandled = false;
    }, 300);
  };

  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction(action);
    }
  };

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: "10px",
        left: "40px",
        zIndex: 1000
      }}
    >
      {/* Gear Icon */}
      <img
        src={gearIcon}
        alt="Settings"
        role="button"
        tabIndex="0"
        onMouseDown={handleToggle}
        onTouchStart={handleToggle}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? handleToggle() : null
        }
        style={{
          width: "32px",
          height: "32px",
          cursor: "pointer",
          zIndex: 2,
        }}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "40px", // appears below the icon
            left: "0px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "10px",
            zIndex: 1,
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          <div
            role="button"
            tabIndex="0"
            onMouseDown={() => handleAction(onNewProblem)}
            onTouchStart={() => handleAction(onNewProblem)}
            onKeyDown={(e) => handleKeyDown(e, onNewProblem)}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "6px",
              marginBottom: "6px",
            }}
          >
            🔄 새 문제
          </div>
          <div
            role="button"
            tabIndex="0"
            onMouseDown={() => handleAction(onResetScore)}
            onTouchStart={() => handleAction(onResetScore)}
            onKeyDown={(e) => handleKeyDown(e, onResetScore)}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            🧹 점수 초기화
          </div>
        </div>
      )}

      {/* CSS animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default SettingsMenu;
