"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Play, Pause, Trash2, Plus, Music } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { PlaylistWithSongs, Song } from "@/types";
import SongRow from "@/components/SongRow";
import { addSongToPlaylist, removeSongFromPlaylist, deletePlaylist } from "@/app/actions/playlists";

interface PlaylistDetailProps {
  playlist: PlaylistWithSongs;
  availableSongs: Song[];
}

export default function PlaylistDetail({ playlist, availableSongs }: PlaylistDetailProps) {
  const router = useRouter();
  const { playSong, currentSong, isPlaying, pauseSong, resumeSong } = usePlayerStore();

  const [songs, setSongs] = useState(
    playlist.playlist_songs
      .sort((a, b) => a.position - b.position)
      .map((ps) => ps.song)
  );
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);

  const isPlaylistPlaying =
    isPlaying && currentSong && songs.some((s) => s.id === currentSong.id);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isPlaylistPlaying) {
      pauseSong();
    } else if (currentSong && songs.some((s) => s.id === currentSong.id)) {
      resumeSong();
    } else {
      playSong(songs[0], songs);
    }
  };

  const handleAddSong = async (songId: string) => {
    setAdding(songId);
    const result = await addSongToPlaylist(playlist.id, songId);
    if (!result.error) {
      const addedSong = availableSongs.find((s) => s.id === songId);
      if (addedSong) setSongs((prev) => [...prev, addedSong]);
      router.refresh();
    }
    setAdding(null);
  };

  const handleRemoveSong = async (songId: string) => {
    const result = await removeSongFromPlaylist(playlist.id, songId);
    if (!result.error) {
      setSongs((prev) => prev.filter((s) => s.id !== songId));
      router.refresh();
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm(`Delete "${playlist.name}"? This cannot be undone.`)) return;
    await deletePlaylist(playlist.id);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#4738a1] to-[#121212] flex flex-col md:flex-row items-center md:items-end text-center md:text-left px-5 pt-12 md:p-8 md:pt-[120px] pb-6 md:pb-8 gap-5 md:gap-6">
        <div className="w-[160px] h-[160px] md:w-[192px] md:h-[192px] shrink-0 flex items-center justify-center rounded-lg shadow-[0_16px_48px_rgba(0,0,0,0.6)] bg-gradient-to-br from-[#4738a1] to-[#1e1e5e]">
          <Music className="w-16 h-16 md:w-16 md:h-16 text-white/70" />
        </div>
        <div className="flex flex-col items-center md:items-start">
          <p className="text-white text-xs font-semibold uppercase tracking-[0.1em] mb-1">
            Playlist
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "clamp(1.5rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginTop: "0.25rem",
              marginBottom: "0.5rem",
            }}
          >
            {playlist.name}
          </h1>
          <p className="text-[#b3b3b3] text-sm mt-1">
            {songs.length} song{songs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8">
        {/* Controls */}
        <div className="flex items-center justify-center md:justify-start gap-4 py-6">
          <button
            onClick={handlePlayAll}
            disabled={songs.length === 0}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: songs.length === 0 ? "#555" : "#1db954",
              border: "none",
              cursor: songs.length === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
              transition: "transform 0.1s",
            }}
            onMouseEnter={(e) => songs.length > 0 && (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isPlaylistPlaying ? (
              <Pause size={24} style={{ color: "#000" }} />
            ) : (
              <Play size={24} style={{ color: "#000", marginLeft: "3px" }} />
            )}
          </button>

          <button
            onClick={() => setShowAddSongs(!showAddSongs)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "500px",
              border: "1px solid #555",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "border-color 0.2s",
            }}
          >
            <Plus size={16} />
            Add songs
          </button>

          <button
            onClick={handleDeletePlaylist}
            style={{
              background: "none",
              border: "none",
              color: "#b3b3b3",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              transition: "color 0.2s",
            }}
            title="Delete playlist"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Song list */}
        {songs.length === 0 ? (
          <div className="text-center py-12 text-[#b3b3b3]">
            No songs yet. Add some using the button above.
          </div>
        ) : (
          <div>
            {/* Header row */}
            <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[40px_40px_1fr_1fr_auto_auto] gap-3 md:gap-4 px-3 md:px-4 pb-3 border-b border-[#1e1e30] mb-2 items-center">
              <span className="hidden md:block text-[#b3b3b3] text-xs text-center font-medium">#</span>
              <span /> {/* Spacer for Cover */}
              <span className="text-[#b3b3b3] text-xs uppercase tracking-[0.1em] font-medium">Title</span>
              <span className="hidden md:block text-[#b3b3b3] text-xs uppercase tracking-[0.1em] font-medium">Artist</span>
              <span className="hidden md:block" /> {/* Spacer for add button */}
              <span className="text-[#b3b3b3] text-xs text-right pr-2">⏱</span>
            </div>

            {songs.map((song, i) => (
              <div key={song.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <SongRow
                    song={song}
                    index={i}
                    queue={songs}
                    onAddToPlaylist={undefined}
                  />
                </div>
                <button
                  onClick={() => handleRemoveSong(song.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#b3b3b3",
                    cursor: "pointer",
                    padding: "8px 16px 8px 0",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s",
                  }}
                  title="Remove from playlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Songs Panel */}
        {showAddSongs && availableSongs.length > 0 && (
          <div
            style={{
              marginTop: "2rem",
              background: "#181818",
              borderRadius: "12px",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ color: "#fff", fontWeight: 700, marginBottom: "1rem" }}>
              Add songs to this playlist
            </h3>
            {availableSongs.map((song) => (
              <div
                key={song.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 0",
                  borderBottom: "1px solid #242424",
                }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                  {song.cover_url ? (
                    <Image src={song.cover_url} alt={song.title} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#333", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Music size={16} style={{ color: "#b3b3b3" }} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ color: "#fff", fontSize: "0.875rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{song.title}</div>
                  <div style={{ color: "#b3b3b3", fontSize: "0.75rem" }}>{song.artist}</div>
                </div>
                <button
                  onClick={() => handleAddSong(song.id)}
                  disabled={adding === song.id}
                  style={{
                    padding: "6px 16px",
                    borderRadius: "500px",
                    border: "1px solid #555",
                    background: adding === song.id ? "#555" : "transparent",
                    color: "#fff",
                    cursor: adding === song.id ? "not-allowed" : "pointer",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {adding === song.id ? "Adding…" : "Add"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
