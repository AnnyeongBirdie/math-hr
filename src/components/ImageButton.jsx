import React from "react";

function ImageButton({ src, alt = "", onAction, style = {} }) {
  let wasHandled = false;

  const handleAction = (e) => {
    if (wasHandled) return;
    wasHandled = true;

    onAction?.(e);

    // Reset debounce lock
    setTimeout(() => {
      wasHandled = false;
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // prevent scrolling for space
      handleAction(e);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      role="button"
      tabIndex="0"
      draggable="false"
      onMouseDown={handleAction}
      onTouchStart={handleAction}
      onKeyDown={handleKeyDown}
      style={{
        cursor: "pointer",
        outline: "none",
        ...style,
      }}
    />
  );
}

export default ImageButton;
