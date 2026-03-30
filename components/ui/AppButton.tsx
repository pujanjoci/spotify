import React, { useState } from "react";

type Variant = "primary" | "ghost" | "danger";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: Variant;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const variants: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
    border: "none",
  },
  ghost: {
    background: "rgba(255,255,255,0.05)",
    color: "#a0a0b8",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "none",
  },
  danger: {
    background: "rgba(239,68,68,0.15)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.25)",
    boxShadow: "none",
  },
};

export default function AppButton({
  loading = false,
  variant = "primary",
  children,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const [pressed, setPressed] = useState(false);
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "12px 28px",
        borderRadius: "14px",
        fontSize: "0.9375rem",
        fontWeight: 700,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "transform 0.15s ease, opacity 0.2s, box-shadow 0.2s",
        transform: pressed && !isDisabled ? "scale(0.96)" : "scale(1)",
        opacity: isDisabled ? 0.55 : 1,
        width: fullWidth ? "100%" : undefined,
        letterSpacing: "0.01em",
        ...variants[variant],
        ...style,
      }}
    >
      {loading && (
        <span
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            animation: "spin 0.7s linear infinite",
            flexShrink: 0,
          }}
        />
      )}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
