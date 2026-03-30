"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { User, Camera, Music2, ListMusic, Check, Mail, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadFile } from "@/lib/storage";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import AppButton from "@/components/ui/AppButton";
import InputField from "@/components/ui/InputField";

interface ProfileFormProps {
  userId: string;
  initialDisplayName: string | null;
  initialAvatarUrl: string | null;
  email: string;
  songCount: number;
  playlistCount: number;
}

export default function ProfileForm({
  userId,
  initialDisplayName,
  initialAvatarUrl,
  email,
  songCount,
  playlistCount,
}: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only PNG, JPG and WebP images are supported.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Avatar must be under 2MB");
      return;
    }

    setUploadingAvatar(true);
    setError(null);
    const ext = file.name.split(".").pop() ?? "png";
    const path = `${userId}/avatar.${ext}`;
    const url = await uploadFile("avatars", path, file);
    if (url) {
      setAvatarUrl(url);
    } else {
      setError("Avatar upload failed. Check bucket MIME type settings.");
    }
    setUploadingAvatar(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .update({ display_name: displayName.trim(), avatar_url: avatarUrl })
      .eq("id", userId);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
    savingRef.current = false;
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-full px-4 py-8 md:px-6 md:py-10 pb-28 md:pb-12 flex flex-col items-center">
      {/* Ambient glow */}
      <div
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124,58,237,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-[520px] relative z-10 flex flex-col gap-6">
        {/* Profile Header Card */}
        <GlassCard glow className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center gap-5">
            {/* Avatar with glow ring */}
            <div style={{ position: "relative" }}>
              {/* Glow ring */}
              <div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa, #7c3aed)",
                  padding: "3px",
                  zIndex: 0,
                  animation: "spin 4s linear infinite",
                }}
              />
              <div className="relative w-[96px] h-[96px] rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#2a2a40] to-[#1c1c2e] z-10 border-[3px] border-[#0d0d14]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    sizes="96px"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <User size={40} style={{ color: "#a0a0b8" }} />
                )}
              </div>

              {/* Camera button */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-0.5 -right-0.5 w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] border-2 border-[#0d0d14] flex items-center justify-center z-20 shadow-[0_2px_10px_rgba(124,58,237,0.5)] transition-transform duration-150 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-110"
                title="Change avatar"
              >
                {uploadingAvatar ? (
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      animation: "spin 0.7s linear infinite",
                      display: "block",
                    }}
                  />
                ) : (
                  <Camera size={14} style={{ color: "#fff" }} />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Name + email */}
            <div>
              <h2 className="text-white text-[1.375rem] font-extrabold tracking-tight mb-1">
                {displayName || "Your Name"}
              </h2>
              <div className="flex items-center justify-center gap-[6px] text-[#5a5a7a] text-sm">
                <Mail size={14} />
                {email}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-6 pt-4 border-t border-white/5 w-full justify-center">
              <StatBadge icon={Music2} value={songCount} label="Tracks" />
              <div className="w-[1px] bg-white/5" />
              <StatBadge icon={ListMusic} value={playlistCount} label="Playlists" />
            </div>
          </div>
        </GlassCard>

        {/* Edit Form Card */}
        <GlassCard className="p-6 min-w-full">
          <h3 className="text-white text-base font-bold mb-5 tracking-tight">
            Edit Profile
          </h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <InputField
              id="display-name"
              label="Display Name"
              placeholder="Your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={50}
            />

            <InputField
              id="email-field"
              label="Email"
              value={email}
              disabled
              hint="Email cannot be changed here."
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <AppButton
              type="submit"
              loading={saving}
              disabled={saving}
              fullWidth
              className="mt-1"
            >
              {saved ? <><Check size={16} /> Saved!</> : "Save Changes"}
            </AppButton>
          </form>
        </GlassCard>

        {/* Danger zone */}
        <GlassCard className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-white font-semibold text-[0.9rem] m-0">
                Sign out
              </p>
              <p className="text-[#5a5a7a] text-sm mt-1 mb-0">
                You will be redirected to the login page.
              </p>
            </div>
            <AppButton
              variant="danger"
              onClick={handleLogout}
              className="px-5 py-2.5 text-sm w-full sm:w-auto active:scale-95"
            >
              <LogOut size={16} />
              Log out
            </AppButton>
          </div>
        </GlassCard>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function StatBadge({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Icon size={14} className="text-[#a78bfa]" />
        <span className="text-white font-extrabold text-xl">{value}</span>
      </div>
      <span className="text-[#5a5a7a] text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
