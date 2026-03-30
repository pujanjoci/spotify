"use client";

import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import SongCard from "@/components/SongCard";
import { Song } from "@/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setAllSongs((data as Song[]) ?? []);
        setResults((data as Song[]) ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      setResults(allSongs);
      return;
    }
    setResults(
      allSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q)
      )
    );
  }, [query, allSongs]);

  return (
    <div className="px-4 py-8 md:p-8 pb-24 md:pb-8">
      <h1 className="text-white text-2xl md:text-[1.75rem] font-extrabold mb-6">
        Search
      </h1>

      {/* Search Input */}
      <div className="relative max-w-[480px] mb-8">
        <SearchIcon
          size={18}
          className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[#b3b3b3] pointer-events-none"
        />
        <input
          id="search-input"
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full py-[14px] pr-[14px] pl-[44px] rounded-full border-none bg-[#2a2a2a] text-white text-base outline-none focus:ring-2 focus:ring-[#7c3aed]/50 transition-shadow"
        />
      </div>

      {/* Results */}
      {loading ? (
        <p style={{ color: "#b3b3b3" }}>Loading…</p>
      ) : results.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <p style={{ color: "#b3b3b3", fontSize: "1rem" }}>
            {query ? `No results for "${query}"` : "No songs found"}
          </p>
        </div>
      ) : (
        <>
          {query && (
            <p style={{ color: "#b3b3b3", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {results.map((song) => (
              <SongCard key={song.id} song={song} queue={results} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
