"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import InputField from "@/components/ui/InputField";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const submittingRef = useRef(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    submittingRef.current = true;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      submittingRef.current = false;
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 2000);
    }
  };

  if (success) {
    return (
      <div
        style={{
          background: "rgba(19,19,31,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "3rem 2.5rem",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 80px rgba(124,58,237,0.1)",
          animation: "fadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
          }}
        >
          <CheckCircle2 size={32} style={{ color: "#fff" }} />
        </div>
        <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 8px" }}>
          Password Updated!
        </h2>
        <p style={{ color: "#a0a0b8", margin: 0 }}>Taking you to SoundWave…</p>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

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
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
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
          <Lock size={28} style={{ color: "#fff" }} />
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
          Update Password
        </h1>
        <p style={{ color: "#5a5a7a", fontSize: "0.9rem", margin: 0 }}>
          Create a new secure password for your account.
        </p>
      </div>

      <form
        onSubmit={handleUpdatePassword}
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
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
            New Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
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
              tabIndex={-1}
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
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Password strength hint */}
          {password.length > 0 && (
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: "3px",
                    borderRadius: "2px",
                    background:
                      password.length >= 8 + i * 4
                        ? i === 0 ? "#f59e0b" : i === 1 ? "#a78bfa" : "#22c55e"
                        : password.length >= 6 && i === 0
                        ? "#ef4444"
                        : "rgba(255,255,255,0.08)",
                    transition: "background 0.3s",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="confirmPassword"
            style={{
              color: "#a0a0b8",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            Confirm Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
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
              onClick={() => setShowConfirmPassword((v) => !v)}
              tabIndex={-1}
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
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

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

        <AppButton
          type="submit"
          loading={loading}
          disabled={loading}
          fullWidth
          style={{ padding: "14px", borderRadius: "14px", fontSize: "1rem", marginTop: "0.5rem" }}
        >
          {loading ? "Updating..." : "Update Password"}
        </AppButton>
      </form>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
