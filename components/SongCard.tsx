"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types";

interface SongCardProps {
  song: Song;
  queue?: Song[];
}

const SongCard = memo(function SongCard({ song, queue }: SongCardProps) {
  const { playSong, currentSong, isPlaying, pauseSong, resumeSong } = usePlayerStore();
  const [hovered, setHovered] = useState(false);

  const isCurrentSong = currentSong?.id === song.id;

  const handleClick = () => {
    if (isCurrentSong) {
      isPlaying ? pauseSong() : resumeSong();
    } else {
      playSong(song, queue);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl p-[14px] cursor-pointer transition-all duration-250 ease-out border active:scale-95"
      style={{
        background: hovered
          ? "linear-gradient(145deg, #252538 0%, #1c1c2e 100%)"
          : "#13131f",
        borderColor: hovered || isCurrentSong ? "#2a2a40" : "transparent",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15)"
          : "none",
      }}
      onClick={handleClick}
    >
      {/* Cover Art */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "12px",
          boxShadow: isCurrentSong
            ? "0 8px 24px rgba(124,58,237,0.4)"
            : "0 8px 24px rgba(0,0,0,0.5)",
        }}
      >
        {song.cover_url ? (
          <Image
            src={song.cover_url}
            alt={song.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            style={{ objectFit: "cover" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, #2a2a40 0%, #1c1c2e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 24 24" width="40" height="40" fill="#5a5a7a">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}

        {/* Play button overlay */}
        <div
          className="absolute bottom-2 right-2 transition-all duration-200"
          style={{
            opacity: hovered || isCurrentSong ? 1 : 0,
            transform: hovered || isCurrentSong ? "translateY(0) scale(1)" : "translateY(8px) scale(0.8)",
          }}
        >
          <button
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(124,58,237,0.6)",
            }}
          >
            {isCurrentSong && isPlaying ? (
              <Pause size={18} style={{ color: "#fff" }} />
            ) : (
              <Play size={18} style={{ color: "#fff", marginLeft: "2px" }} />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          fontWeight: 700,
          fontSize: "0.9375rem",
          color: isCurrentSong ? "#a78bfa" : "#fff",
          marginBottom: "4px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color 0.2s",
        }}
      >
        {song.title}
      </div>
      <div
        style={{
          fontSize: "0.8125rem",
          color: "#a0a0b8",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {song.artist}
      </div>

      {/* Animated waveform indicator if currently playing */}
      {isCurrentSong && isPlaying && (
        <div className="waveform" style={{ position: "absolute", top: "12px", right: "12px" }}>
          <span />
          <span />
          <span />
        </div>
      )}
    </div>
  );
});

export default SongCard;
