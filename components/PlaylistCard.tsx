"use client";

import Link from "next/link";
import { Music2 } from "lucide-react";
import { Playlist } from "@/types";
import { useState } from "react";

interface PlaylistCardProps {
  playlist: Playlist;
  songCount?: number;
}

export default function PlaylistCard({ playlist, songCount }: PlaylistCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/playlist/${playlist.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block rounded-2xl p-[14px] cursor-pointer transition-all duration-250 ease-out no-underline border active:scale-95"
      style={{
        background: hovered
          ? "linear-gradient(145deg, #252538 0%, #1c1c2e 100%)"
          : "#13131f",
        borderColor: hovered ? "#2a2a40" : "transparent",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.15)"
          : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          paddingBottom: "100%",
          position: "relative",
          background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)",
          borderRadius: "10px",
          marginBottom: "12px",
          boxShadow: hovered
            ? "0 8px 24px rgba(124,58,237,0.5)"
            : "0 8px 24px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.25s",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Music2 size={40} style={{ color: "rgba(255,255,255,0.8)" }} />
        </div>
      </div>
      <div
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.9375rem",
          marginBottom: "4px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {playlist.name}
      </div>
      <div style={{ color: "#a0a0b8", fontSize: "0.8125rem" }}>
        {songCount !== undefined ? `${songCount} songs` : "Playlist"}
      </div>
    </Link>
  );
}
