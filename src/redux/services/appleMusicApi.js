import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appleMusicApi = createApi({
  reducerPath: "appleMusicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://itunes.apple.com/",
  }),
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      query: () => "search?term=music&media=music&entity=song&limit=20",
      transformResponse: (response) => {
        const songs = response?.results || [];
        
        if (songs.length > 0) {
          return songs.filter(song => song.previewUrl).map((song, i) => ({
            key: song.trackId || `chart-${i}`,
            title: song.trackName,
            subtitle: song.artistName,
            images: { coverart: song.artworkUrl100?.replace("100x100bb.jpg", "600x600bb.jpg") || "https://via.placeholder.com/600x600" },
            artists: [{ adamid: song.artistId || "unknown" }],
            hub: { actions: [{ uri: "#" }, { uri: song.previewUrl }] },
            previewUrl: song.previewUrl,
          }));
        }
        
        return generateFallbackSongs();
      },
    }),
    
    searchSongs: builder.query({
      query: (searchTerm) => `search?term=${encodeURIComponent(searchTerm)}&media=music&entity=song&limit=20`,
      transformResponse: (response) => {
        const songs = response?.results || [];
        
        if (songs.length > 0) {
          return songs.filter(song => song.previewUrl).map((song, i) => ({
            key: song.trackId || `search-${i}`,
            title: song.trackName,
            subtitle: song.artistName,
            images: { coverart: song.artworkUrl100?.replace("100x100bb.jpg", "600x600bb.jpg") || "https://via.placeholder.com/600x600" },
            artists: [{ adamid: song.artistId || "unknown" }],
            hub: { actions: [{ uri: "#" }, { uri: song.previewUrl }] },
            previewUrl: song.previewUrl,
          }));
        }
        
        return [];
      },
    }),
  }),
});

const generateFallbackSongs = () => {
  return [
    {
      key: "fallback-1",
      title: "Ambient Waves",
      subtitle: "SoundHelix",
      images: { coverart: "https://via.placeholder.com/600x600/4A90E2/FFFFFF?text=Music" },
      artists: [{ adamid: "soundhelix" }],
      hub: { actions: [{ uri: "#" }, { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" }] },
      previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      key: "fallback-2", 
      title: "Electronic Dreams",
      subtitle: "SoundHelix",
      images: { coverart: "https://via.placeholder.com/600x600/7B68EE/FFFFFF?text=Music" },
      artists: [{ adamid: "soundhelix" }],
      hub: { actions: [{ uri: "#" }, { uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }] },
      previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    }
  ];
};

export const { useGetTopChartsQuery, useSearchSongsQuery } = appleMusicApi;
