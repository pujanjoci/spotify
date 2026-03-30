import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  glowColor?: string;
  padding?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  glow = false,
  glowColor = "rgba(124,58,237,0.2)",
  padding = "2rem",
  style,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        background: "rgba(19,19,31,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "24px",
        padding,
        boxShadow: glow
          ? `0 0 0 1px rgba(124,58,237,0.15), 0 20px 60px rgba(0,0,0,0.4), 0 0 80px ${glowColor}`
          : "0 20px 60px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
