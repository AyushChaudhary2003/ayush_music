import React from 'react';
import {FaPauseCircle, FaPlayCircle} from 'react-icons/fa';

const PlayPause = ({ isPlaying, activeSong, song, handlePause, handlePlay }) => {
  const isCurrentSong = activeSong?.key === song?.key || activeSong?.title === song?.title;
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isPlaying && isCurrentSong) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  return (
    <div className="cursor-pointer hover:scale-110 transition-transform">
      {isPlaying && isCurrentSong ? (
        <FaPauseCircle 
          size={35}
          className="text-gray-300 hover:text-white transition-colors"     
          onClick={handleClick} 
        />
      ) : (
        <FaPlayCircle 
          size={35}
          className="text-gray-300 hover:text-white transition-colors"
          onClick={handleClick} 
        />
      )}
    </div>
  );
};

export default PlayPause;
