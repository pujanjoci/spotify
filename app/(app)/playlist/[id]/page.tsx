import { notFound } from "next/navigation";
import { getPlaylistWithSongs } from "@/lib/playlists";
import { getRecentSongs } from "@/lib/songs";
import PlaylistDetail from "./PlaylistDetail";

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [playlist, allSongs] = await Promise.all([
    getPlaylistWithSongs(id),
    getRecentSongs(50),
  ]);

  if (!playlist) {
    notFound();
  }

  // Songs not yet in the playlist
  const playlistSongIds = new Set(
    playlist.playlist_songs.map((ps) => ps.song_id)
  );
  const availableSongs = allSongs.filter((s) => !playlistSongIds.has(s.id));

  return (
    <PlaylistDetail
      playlist={playlist}
      availableSongs={availableSongs}
    />
  );
}
