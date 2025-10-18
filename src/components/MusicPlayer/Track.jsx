import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => (
  <div className="flex items-center justify-start min-w-0">
    <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-12 w-12 mr-3 flex-shrink-0`}>
      <img 
        src={activeSong?.images?.coverart || activeSong?.artworkUrl100?.replace('100x100', '600x600') || 'https://via.placeholder.com/400x400/1a1a1a/ffffff?text=♪'} 
        alt={`${activeSong?.title || 'No Song'} cover art`} 
        className="rounded-full object-cover w-full h-full" 
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x400/2d2d2d/ffffff?text=♪';
        }}
      />
    </div>
    <div className="flex-1 min-w-0 max-w-48">
      <p className="truncate text-white font-bold text-sm">
        {activeSong?.title || 'No active Song'}
      </p>
      <p className="truncate text-gray-300 text-xs">
        {activeSong?.subtitle || 'No active Song'}
      </p>
      
      {/* Preview Indicator */}
      {activeSong && (activeSong.previewUrl || activeSong.hub?.actions?.[1]?.uri) && (
        <div className="text-xs text-blue-400 mt-1">
          🎵 30s preview
        </div>
      )}
    </div>
  </div>
);

export default Track;
