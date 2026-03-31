"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { Play, Pause, Plus } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { Song } from "@/types";

interface SongRowProps {
  song: Song;
  index: number;
  queue?: Song[];
  onAddToPlaylist?: (songId: string) => void;
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "-";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SongRow = memo(function SongRow({ song, index, queue, onAddToPlaylist }: SongRowProps) {
  const { playSong, currentSong, isPlaying, pauseSong, resumeSong } = usePlayerStore();
  const [hovered, setHovered] = useState(false);

  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
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
      className={`grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_40px_1fr_1fr_auto_auto] items-center gap-3 md:gap-4 px-3 md:px-4 py-2 rounded-[10px] cursor-pointer transition-colors active:scale-[0.98] md:active:scale-100 ${
        hovered ? "bg-[#7c3aed]/10" : "bg-transparent"
      }`}
      onClick={handlePlay}
    >
      {/* Index / Play Button */}
      <div
        className="hidden md:block text-center text-[0.875rem]"
        style={{ color: isCurrentSong ? "#a78bfa" : "#a0a0b8" }}
      >
        {hovered ? (
          isCurrentSong && isPlaying ? (
            <Pause size={16} className="text-white mx-auto" />
          ) : (
            <Play size={16} className="text-white ml-[2px] mx-auto" />
          )
        ) : isCurrentSong && isPlaying ? (
          <div className="waveform mx-auto">
            <span />
            <span />
            <span />
          </div>
        ) : (
          index + 1
        )}
      </div>

      {/* Cover */}
      <div className="relative w-[40px] h-[40px] shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#2a2a40] to-[#1c1c2e]">
        {song.cover_url ? (
          <Image
            src={song.cover_url}
            alt={song.title}
            fill
            sizes="40px"
            className="object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#5a5a7a">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        )}
      </div>

      {/* Title + Artist */}
      <div className="overflow-hidden">
        <div
          className="font-medium whitespace-nowrap overflow-hidden text-ellipsis transition-colors text-[0.9375rem]"
          style={{ color: isCurrentSong ? "#a78bfa" : "#fff" }}
        >
          {song.title}
        </div>
        <div className="text-[#a0a0b8] text-[0.8125rem] whitespace-nowrap overflow-hidden text-ellipsis md:hidden mt-[2px]">
          {song.artist}
        </div>
      </div>

      {/* Artist (second column - Desktop only) */}
      <div className="hidden md:block text-[#a0a0b8] text-[0.875rem] whitespace-nowrap overflow-hidden text-ellipsis">
        {song.artist}
      </div>

      {/* Add to playlist */}
      {onAddToPlaylist ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(song.id);
          }}
          className={`hidden md:flex p-[6px] rounded-lg items-center transition-colors duration-200 border-none cursor-pointer active:scale-95 ${
            hovered ? "bg-[#7c3aed]/20 text-[#a78bfa]" : "bg-transparent text-transparent"
          }`}
          title="Add to playlist"
        >
          <Plus size={16} />
        </button>
      ) : (
        <span className="hidden md:block" />
      )}

      {/* Duration */}
      <div className="text-[#a0a0b8] text-[0.875rem] text-right">
        {formatDuration(song.duration)}
      </div>
    </div>
  );
});

export default SongRow;
