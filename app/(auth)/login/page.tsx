"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import InputField from "@/components/ui/InputField";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      submittingRef.current = false;
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div
      style={{
        background: "rgba(19,19,31,0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem",
        boxShadow:
          "0 0 0 1px rgba(124,58,237,0.12), 0 24px 80px rgba(0,0,0,0.5), 0 0 80px rgba(124,58,237,0.1)",
        animation: "fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      {/* Logo + heading */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        {/* SoundWave icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
          }}
        >
          <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
            <rect x="0" y="5" width="3.5" height="8" rx="1.75" fill="white" />
            <rect x="5.5" y="1.5" width="3.5" height="15" rx="1.75" fill="white" />
            <rect x="11" y="0" width="3.5" height="18" rx="1.75" fill="white" />
            <rect x="16.5" y="4" width="3.5" height="10" rx="1.75" fill="white" />
            <rect x="22" y="6.5" width="3.5" height="5" rx="1.75" fill="white" />
          </svg>
        </div>
        <h1
          style={{
            color: "#fff",
            fontSize: "1.625rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "0 0 6px",
          }}
        >
          Welcome back
        </h1>
        <p style={{ color: "#5a5a7a", fontSize: "0.9rem", margin: 0 }}>
          Log in to your SoundWave account
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <InputField
          id="email"
          type="email"
          label="Email address"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        {/* Password with eye toggle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="password"
            style={{
              color: "#a0a0b8",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "12px 44px 12px 16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(37,37,56,0.7)",
                color: "#fff",
                fontSize: "0.9375rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#5a5a7a",
                display: "flex",
                padding: "4px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#5a5a7a")}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
              borderRadius: "12px",
              padding: "11px 14px",
              fontSize: "0.875rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Forgot password */}
        <div style={{ textAlign: "right", marginTop: "-4px" }}>
          <Link
            href="/reset-password"
            style={{
              color: "#a78bfa",
              fontSize: "0.8375rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            Forgot password?
          </Link>
        </div>

        <AppButton
          type="submit"
          loading={loading}
          disabled={loading}
          fullWidth
          style={{ padding: "14px", borderRadius: "14px", fontSize: "1rem" }}
        >
          {loading ? "Signing in…" : "Sign In"}
        </AppButton>
      </form>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          margin: "1.75rem 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        <span style={{ color: "#5a5a7a", fontSize: "0.8rem" }}>New here?</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Sign up link */}
      <Link
        href="/signup"
        style={{
          display: "block",
          textAlign: "center",
          padding: "12px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(255,255,255,0.03)",
          color: "#e0e0f0",
          fontWeight: 600,
          fontSize: "0.9375rem",
          textDecoration: "none",
          transition: "background 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(124,58,237,0.1)";
          e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }}
      >
        Create a SoundWave account →
      </Link>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
