import React from "react";

const DifficultyBadge = ({ difficulty }) => {
  const getDifficultyConfig = (difficulty) => {
    switch (difficulty) {
      case "쉬움":
        return {
          emoji: "🌱",
          color: "#27ae60", // Green
          bgColor: "#d5f4e6",
          text: "쉬움"
        };
      case "보통":
        return {
          emoji: "⚡",
          color: "#f39c12", // Orange/Yellow
          bgColor: "#fef9e7",
          text: "보통"
        };
      case "어려움":
        return {
          emoji: "🔥",
          color: "#e74c3c", // Red
          bgColor: "#fadbd8",
          text: "어려움"
        };
      default:
        return {
          emoji: "🌱",
          color: "#27ae60",
          bgColor: "#d5f4e6",
          text: "쉬움"
        };
    }
  };

  const config = getDifficultyConfig(difficulty);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        backgroundColor: config.bgColor,
        color: config.color,
        padding: "8px 12px",
        borderRadius: "20px",
        border: `2px solid ${config.color}`,
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "arial",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <span style={{ fontSize: "16px" }}>{config.emoji}</span>
      <span>{config.text}</span>
    </div>
  );
};

export default DifficultyBadge;