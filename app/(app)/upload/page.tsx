import UploadForm from "@/components/UploadForm";
import GlassCard from "@/components/ui/GlassCard";
import { Music2 } from "lucide-react";

export default function UploadPage() {
  return (
    <div
      style={{
        minHeight: "100%",
        padding: "2.5rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Ambient glow behind card */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "400px",
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ width: "100%", maxWidth: "560px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 32px rgba(124,58,237,0.45)",
            }}
          >
            <Music2 size={26} style={{ color: "#fff" }} />
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: "1.75rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              marginBottom: "0.5rem",
            }}
          >
            Upload a Track
          </h1>
          <p style={{ color: "#a0a0b8", fontSize: "0.9375rem" }}>
            Share your music. Supported: MP3, WAV, FLAC, OGG, AAC.
          </p>
        </div>

        {/* Glass card */}
        <GlassCard glow padding="2rem">
          <UploadForm />
        </GlassCard>
      </div>
    </div>
  );
}
