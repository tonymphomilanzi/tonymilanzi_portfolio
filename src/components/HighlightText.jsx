// HighlightText.jsx
import React from "react";

const HighlightText = ({ children, fromColor = "lime-300", toColor = "yellow-400" }) => {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-${fromColor} to-${toColor}`}>
      {children}
    </span>
  );
};

export default HighlightText;
