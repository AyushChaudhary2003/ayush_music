import React from 'react';
import { useDispatch } from 'react-redux';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer group">
      <div className="relative w-full h-56 group-hover:shadow-lg transition-all duration-300">
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.title ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        
        <img 
          alt={`${song.title} by ${song.subtitle}`} 
          src={song.images?.coverart || song.artworkUrl100?.replace('100x100', '600x600') || 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=No+Cover'} 
          className="w-full h-full rounded-lg object-cover" 
          onError={(e) => {
            // Fallback to a generic music cover placeholder
            e.target.src = 'https://via.placeholder.com/400x400/2d2d2d/ffffff?text=♪';
          }}
        />
      </div>

      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate hover:text-cyan-400 transition-colors">
          {song.title}
        </p>
        <p className="text-sm truncate text-gray-300 mt-1 hover:text-gray-100 transition-colors">
          {song.subtitle}
        </p>
        
        {/* Preview Available Indicator */}
        {(song.previewUrl || song.hub?.actions?.[1]?.uri) && (
          <div className="mt-2 text-xs text-green-400">
            🎵 Preview Available
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;