"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/storage";
import { createSong } from "@/app/actions/songs";
import GlassCard from "@/components/ui/GlassCard";
import AppButton from "@/components/ui/AppButton";
import InputField from "@/components/ui/InputField";
import UploadZone from "@/components/ui/UploadZone";
import { Music2, CheckCircle2 } from "lucide-react";

export default function UploadForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Prevent double-submit
  const submittingRef = useRef(false);

  const handleAudioSelected = useCallback((file: File | null) => {
    setAudioFile(file);
    if (!file) { setDuration(null); return; }

    // Auto-fill title from filename
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));

    // Detect duration
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
      URL.revokeObjectURL(url);
    });
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    if (!audioFile || !title.trim() || !artist.trim()) {
      setError("Title, artist and audio file are all required.");
      return;
    }

    submittingRef.current = true;
    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      // 1. Upload audio
      const audioPath = `${Date.now()}-${audioFile.name.replace(/\s+/g, "_")}`;
      const audioUrl = await uploadFile("songs", audioPath, audioFile);
      if (!audioUrl) throw new Error("Audio upload failed — please try again.");
      setProgress(55);

      // 2. Upload cover (optional)
      let coverUrl: string | null = null;
      if (imageFile) {
        const imgPath = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
        coverUrl = await uploadFile("covers", imgPath, imageFile);
      }
      setProgress(80);

      // 3. Insert DB record
      const result = await createSong({
        title: title.trim(),
        artist: artist.trim(),
        audio_url: audioUrl,
        cover_url: coverUrl,
        duration,
      });

      if (result.error) throw new Error(result.error);

      setProgress(100);
      setSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploading(false);
      setProgress(0);
    } finally {
      submittingRef.current = false;
    }
  };

  if (success) {
    return (
      <GlassCard glow className="text-center p-8 md:p-12">
        <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(124,58,237,0.5)]">
          <CheckCircle2 size={36} className="text-white" />
        </div>
        <h2 className="text-white text-2xl font-extrabold mb-2">
          Track uploaded!
        </h2>
        <p className="text-[#a0a0b8]">Redirecting you to the home feed…</p>
      </GlassCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Audio Upload */}
      <div>
        <p style={{ color: "#a0a0b8", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "8px" }}>
          Audio File *
        </p>
        <UploadZone
          type="audio"
          accept="audio/*"
          maxMB={50}
          file={audioFile}
          onChange={handleAudioSelected}
        />
      </div>

      {/* Cover Image */}
      <div>
        <p style={{ color: "#a0a0b8", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "8px" }}>
          Cover Art <span style={{ color: "#5a5a7a", fontWeight: 400, textTransform: "none", fontSize: "0.75rem" }}>(optional)</span>
        </p>
        <UploadZone
          type="image"
          accept="image/*"
          maxMB={5}
          file={imageFile}
          onChange={setImageFile}
        />
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          id="track-title"
          label="Song Title *"
          placeholder="Enter song title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <InputField
          id="track-artist"
          label="Artist *"
          placeholder="Artist name"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          required
        />
      </div>

      {/* Duration display */}
      {duration && (
        <p className="text-[#5a5a7a] text-sm">
          ⏱ Detected duration: {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Progress bar */}
      {uploading && progress > 0 && (
        <div>
          <div className="h-1 bg-white/5 rounded-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-sm transition-all duration-400 ease-out shadow-[0_0_8px_rgba(124,58,237,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[#5a5a7a] text-[0.75rem] mt-1.5">
            Uploading… {progress}%
          </p>
        </div>
      )}

      {/* Submit */}
      <AppButton
        type="submit"
        loading={uploading}
        disabled={uploading || !audioFile || !title.trim() || !artist.trim()}
        fullWidth
        className="mt-1 active:scale-[0.98]"
      >
        <Music2 size={18} />
        {uploading ? "Uploading…" : "Upload Track"}
      </AppButton>
    </form>
  );
}
