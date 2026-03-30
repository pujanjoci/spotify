import React, { useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function InputField({
  label,
  error,
  hint,
  id,
  style,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            color: focused ? "#a78bfa" : "#a0a0b8",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            transition: "color 0.2s",
          }}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "12px",
          border: `1px solid ${focused ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.06)"}`,
          background: "rgba(37,37,56,0.7)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: "0.9375rem",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.15)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          ...style,
        }}
        {...rest}
      />
      {error && (
        <span style={{ color: "#f87171", fontSize: "0.8rem" }}>{error}</span>
      )}
      {hint && !error && (
        <span style={{ color: "#5a5a7a", fontSize: "0.8rem" }}>{hint}</span>
      )}
    </div>
  );
}
