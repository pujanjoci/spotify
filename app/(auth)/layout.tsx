export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "#0d0d14",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow top-left */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Ambient glow bottom-right */}
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-10%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px" }}>
        {children}
      </div>
    </div>
  );
}
