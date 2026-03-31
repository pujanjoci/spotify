"use client";

import { useSession } from "@/hooks/useSession";

/** Formats seconds into M:SS */
function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Mounts silently in the authenticated layout.
 * Becomes visible only when the session is about to expire.
 */
export default function SessionWarning() {
  const { timeRemaining, isExpiringSoon, extendSession, logout } = useSession();

  if (!isExpiringSoon) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="session-warning"
      style={{
        position: "fixed",
        bottom: "calc(90px + 16px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: "320px",
        maxWidth: "calc(100vw - 32px)",
        background: "linear-gradient(135deg, #1c1c2e 0%, #13131f 100%)",
        border: "1px solid rgba(124,58,237,0.5)",
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.2), 0 0 24px rgba(124,58,237,0.15)",
        animation: "session-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.875rem",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          Session expiring in{" "}
          <span style={{ color: "#f59e0b", fontVariantNumeric: "tabular-nums" }}>
            {fmt(timeRemaining)}
          </span>
        </p>
        <p
          style={{
            color: "#a0a0b8",
            fontSize: "0.75rem",
            margin: "4px 0 0",
          }}
        >
          You&apos;ll be logged out automatically.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={extendSession}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.8125rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Stay logged in
        </button>

        <button
          onClick={logout}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1px solid #2a2a40",
            background: "transparent",
            color: "#a0a0b8",
            fontWeight: 600,
            fontSize: "0.8125rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#5a5a7a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#a0a0b8";
            e.currentTarget.style.borderColor = "#2a2a40";
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
