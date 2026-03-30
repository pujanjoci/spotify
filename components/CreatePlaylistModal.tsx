"use client";

import { useEffect, useRef, useState } from "react";
import { Music2, X } from "lucide-react";
import { createPlaylist } from "@/app/actions/playlists";
import { Playlist } from "@/types";

interface CreatePlaylistModalProps {
  onClose: () => void;
  onCreated: (playlist: Playlist) => void;
}

export default function CreatePlaylistModal({
  onClose,
  onCreated,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Dismiss on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Playlist name is required"); return; }
    setLoading(true);
    setError(null);
    const result = await createPlaylist(trimmed);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (result.data) onCreated(result.data as Playlist);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
    >
      <div
        className="bg-gradient-to-b from-[#1c1c2e] to-[#13131f] border border-[#2a2a40] rounded-[20px] p-6 md:p-8 w-full max-w-[420px] shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(124,58,237,0.1)] transition-all"
        style={{ animation: "fadeIn 0.2s ease" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-[36px] h-[36px] rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center">
              <Music2 size={18} className="text-white" />
            </div>
            <h2 className="text-white text-lg font-bold m-0">
              New Playlist
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#a0a0b8] hover:text-white transition-colors bg-transparent border-none cursor-pointer active:scale-95 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="playlist-name"
            className="block text-[#a0a0b8] text-[0.8125rem] font-semibold mb-2 tracking-widest uppercase"
          >
            Playlist Name
          </label>
          <input
            ref={inputRef}
            id="playlist-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My awesome playlist…"
            maxLength={80}
            className={`w-full p-4 md:p-3 rounded-[10px] border bg-[#252538] text-white text-base outline-none transition-all duration-200 focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.2)] ${
              error ? "border-red-500 mb-2" : "border-[#2a2a40] mb-6 md:mb-5"
            }`}
          />

          {error && (
            <p className="text-red-400 text-[0.8125rem] mb-4">
              {error}
            </p>
          )}

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 p-3.5 md:p-3 rounded-[10px] border border-[#2a2a40] bg-transparent text-[#a0a0b8] text-[0.9375rem] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#252538] hover:text-white active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className={`flex-1 p-3.5 md:p-3 rounded-[10px] border-none text-white text-[0.9375rem] font-bold transition-all duration-200 active:scale-95 ${
                loading || !name.trim()
                  ? "bg-[#3d2a6e] cursor-not-allowed shadow-none"
                  : "bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] cursor-pointer shadow-[0_4px_15px_rgba(124,58,237,0.4)] hover:scale-[1.02]"
              }`}
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
