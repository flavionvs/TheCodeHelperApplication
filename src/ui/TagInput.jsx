// src/components/TagInput.js
import React, { useState } from "react";

const TagInput = ({ tags, setTags, placeholder = "Type and press Enter" }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", border: "1px solid #ccc", borderRadius: "4px", padding: "6px" }}>
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            margin: "2px",
            padding: "4px 8px",
            background: "#e0e0e0",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {tag}
          <button
            onClick={() => removeTag(index)}
            style={{
              marginLeft: "6px",
              background: "transparent",
              border: "none",
              color: "#555",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          border: "none",
          flex: 1,
          minWidth: "120px",
          outline: "none",
        }}
      />
    </div>
  );
};

export default TagInput;
