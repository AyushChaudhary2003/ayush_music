import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => (
  <div className="flex-1 flex items-center justify-start">
    <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
      <img 
        src={activeSong?.images?.coverart || activeSong?.artworkUrl100?.replace('100x100', '600x600') || 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=♪'} 
        alt={`${activeSong?.title || 'No Song'} cover art`} 
        className="rounded-full object-cover w-full h-full" 
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400/2d2d2d/ffffff?text=♪';
        }}
      />
    </div>
    <div className="w-[50%]">
      <p className="truncate text-white font-bold text-lg">
        {activeSong?.title || 'No active Song'}
      </p>
      <p className="truncate text-gray-300">
        {activeSong?.subtitle || 'No active Song'}
      </p>
      
      {/* Preview Indicator */}
      {activeSong && (activeSong.previewUrl || activeSong.hub?.actions?.[1]?.uri) && (
        <div className="text-xs text-blue-400 mt-1">
          🎵 Playing 30-second preview
        </div>
      )}
    </div>
  </div>
);

export default Track;
