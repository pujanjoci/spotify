"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/usePlayerStore";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function PlayerBar() {
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    setVolume,
    setProgress,
    setDuration,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.8;

    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => nextSong();

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update src when song changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.src = currentSong.audio_url;
    audio.load();
    if (isPlaying) audio.play();
  }, [currentSong]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (progress / duration) * 100 : 0;

    const barBaseClassName = "fixed bottom-[64px] md:bottom-0 left-0 right-0 h-[72px] md:h-[90px] bg-[#0a0a12]/97 backdrop-blur-2xl border-t border-[#1e1e30] z-[100] pb-[env(safe-area-inset-bottom,0px)]";

  if (!currentSong) {
    return (
      <div className={`${barBaseClassName} flex items-center justify-center`}>
        {/* Subtle glow line at top */}
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#7c3aed]/40 to-transparent" />
        <p className="text-[#5a5a7a] text-sm md:text-[0.875rem]">
          Choose a song to start listening
        </p>
      </div>
    );
  }

  return (
    <div
      className={`${barBaseClassName} flex flex-row items-center justify-between px-4 md:px-5 md:grid md:grid-cols-[1fr_2fr_1fr] gap-3 md:gap-4`}
    >
      {/* Mobile Top Progress Bar */}
      <div className="absolute -top-[10px] left-0 right-0 md:hidden h-[24px] z-[101]">
        {/* Background track */}
        <div className="absolute top-[10px] left-0 right-0 h-[3px] bg-[#252538] pointer-events-none" />
        {/* Fill */}
        <div
          className="absolute top-[10px] left-0 h-[3px] bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] transition-all duration-100 ease-linear pointer-events-none"
          style={{ width: `${progressPct}%` }}
        />
        {/* Range input */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.5}
          value={progress}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-none"
        />
      </div>

      {/* Desktop Accent glow line at top */}
      <div 
        className="hidden md:block absolute top-0 left-[5%] right-[5%] h-[1px] transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(124,58,237,${progressPct / 100 * 0.8 + 0.1}), transparent)`
        }} 
      />

      {/* Song Info */}
      <div className="flex items-center gap-3 overflow-hidden flex-1 md:flex-none max-w-[60%] md:max-w-none">
        <div className="w-[44px] h-[44px] md:w-[52px] md:h-[52px] shrink-0 relative rounded-[10px] overflow-hidden">
          {currentSong.cover_url ? (
            <Image
              src={currentSong.cover_url}
              alt={currentSong.title}
              fill
              sizes="52px"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Volume2 size={20} style={{ color: "rgba(255,255,255,0.8)" }} />
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <div className="text-white font-semibold text-[0.875rem] whitespace-nowrap overflow-hidden text-ellipsis">
            {currentSong.title}
          </div>
          <div className="text-[#a0a0b8] text-[0.75rem] whitespace-nowrap overflow-hidden text-ellipsis">
            {currentSong.artist}
          </div>
        </div>
      </div>

      {/* Center Controls */}
      <div className="flex flex-row md:flex-col items-center gap-[6px]">
        {/* Buttons */}
        <div className="flex items-center gap-[12px] md:gap-[20px]">
          {/* Skip Back - Hidden on smallest screens */}
          <button
            onClick={prevSong}
            className="hidden sm:flex bg-none border-none text-[#a0a0b8] cursor-pointer p-1 items-center transition-all duration-200 hover:text-white hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] justify-center"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={isPlaying ? pauseSong : resumeSong}
            className="w-[44px] h-[44px] md:w-[40px] md:h-[40px] rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] border-none cursor-pointer flex items-center justify-center transition-all duration-150 shadow-[0_4px_16px_rgba(124,58,237,0.5)] hover:scale-105 hover:shadow-[0_6px_20px_rgba(124,58,237,0.7)] active:scale-95 shrink-0"
          >
            {isPlaying ? (
              <Pause size={18} className="text-white" />
            ) : (
              <Play size={18} className="text-white ml-[2px]" />
            )}
          </button>

          {/* Skip Forward - Hidden on smallest screens */}
          <button
            onClick={nextSong}
            className="hidden sm:flex bg-none border-none text-[#a0a0b8] cursor-pointer p-1 items-center transition-all duration-200 hover:text-white hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px] justify-center"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Desktop Seek bar (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-[8px] w-full">
          <span className="text-[#5a5a7a] text-[0.6875rem] min-w-[32px] text-right">
            {formatTime(progress)}
          </span>
          <div className="flex-1 relative h-[4px]">
            {/* Track background */}
            <div className="absolute inset-0 bg-[#252538] rounded-[2px]" />
            {/* Fill */}
            <div
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-[2px] transition-all duration-100 ease-linear pointer-events-none"
              style={{ width: `${progressPct}%` }}
            />
            {/* Invisible range input */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={progress}
              onChange={handleSeek}
              className="absolute top-[-8px] left-0 w-full h-[20px] opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[#5a5a7a] text-[0.6875rem] min-w-[32px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume Control - Hidden on mobile entirely */}
      <div className="hidden md:flex items-center justify-end gap-[8px]">
        <button
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
          className="bg-none border-none text-[#a0a0b8] cursor-pointer p-1 flex items-center transition-colors duration-200 hover:text-white focus:outline-none"
        >
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <div className="relative w-[90px] h-[4px]">
          <div className="absolute inset-0 bg-[#252538] rounded-[2px]" />
          <div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-[2px] pointer-events-none transition-all duration-[50ms]"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute top-[-8px] left-0 w-full h-[20px] opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
