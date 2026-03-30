"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import InputField from "@/components/ui/InputField";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const submittingRef = useRef(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    setLoading(true);
    setSuccess(false);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
      submittingRef.current = false;
    } else {
      setSuccess(true);
    }
    setLoading(false);
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
          <KeyRound size={28} style={{ color: "#fff" }} />
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
          Reset Password
        </h1>
        <p style={{ color: "#5a5a7a", fontSize: "0.9rem", margin: 0 }}>
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {!success ? (
        <form
          onSubmit={handleResetPassword}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
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
            style={{ padding: "14px", borderRadius: "14px", fontSize: "1rem" }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </AppButton>
        </form>
      ) : (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(34,197,94,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <CheckCircle2 size={24} style={{ color: "#22c55e" }} />
          </div>
          <p style={{ color: "#fff", fontWeight: 600, marginBottom: "8px" }}>
            Email Sent!
          </p>
          <p style={{ color: "#a0a0b8", fontSize: "0.875rem", lineHeight: 1.5 }}>
            Check your inbox for the password reset link. It might take a few minutes.
          </p>
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#5a5a7a",
            fontSize: "0.875rem",
            textDecoration: "none",
            fontWeight: 600,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#5a5a7a")}
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
