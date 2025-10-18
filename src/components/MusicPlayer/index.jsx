import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { nextSong, prevSong, playPause } from '../../redux/features/playerSlice';
import Controls from './Controls';
import Player from './Player';
import Seekbar from './Seekbar';
import Track from './Track';
import VolumeBar from './VolumeBar';

const MusicPlayer = () => {
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } = useSelector((state) => state.player);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset time tracking when song changes
    setAppTime(0);
    setSeekTime(0);
    setDuration(0);
  }, [activeSong?.key]);

  useEffect(() => {
    // Auto-play when song changes and player is active
    if (currentSongs.length && isActive && isPlaying) {
      // Ensure playback continues when song changes
      const timer = setTimeout(() => {
        dispatch(playPause(true));
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentSongs.length, isActive, isPlaying, dispatch]);

  const handlePlayPause = () => {
    if (!isActive) return;

    if (isPlaying) {
      dispatch(playPause(false));
    } else {
      dispatch(playPause(true));
    }
  };

  const handleNextSong = () => {
    const wasPlaying = isPlaying;
    
    // Calculate next index
    let nextIndex;
    if (!shuffle) {
      nextIndex = (currentIndex + 1) % currentSongs.length;
    } else {
      nextIndex = Math.floor(Math.random() * currentSongs.length);
    }
    
    // Dispatch next song
    dispatch(nextSong(nextIndex));
    
    // Auto-play next song if we were playing or if song ended naturally
    if (currentSongs.length > 0 && (wasPlaying || isActive)) {
      // Force play state to true for continuous playback
      setTimeout(() => {
        dispatch(playPause(true));
      }, 100);
    }
  };

  const handlePrevSong = () => {
    const wasPlaying = isPlaying;
    
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }

    // Auto-play previous song if we were playing
    if (wasPlaying) {
      setTimeout(() => {
        dispatch(playPause(true));
      }, 100);
    }
  };

  return (
    <div className="relative sm:px-12 px-8 w-full flex items-center">
      <div className="w-1/3 flex justify-start">
        <Track isPlaying={isPlaying} isActive={isActive} activeSong={activeSong} />
      </div>
      <div className="w-1/3 flex flex-col items-center justify-center">
        <Controls
          isPlaying={isPlaying}
          isActive={isActive}
          repeat={repeat}
          setRepeat={setRepeat}
          shuffle={shuffle}
          setShuffle={setShuffle}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min="0"
          max={duration || 30}
          onInput={(event) => {
            const newTime = parseFloat(event.target.value);
            setSeekTime(newTime);
          }}
          setSeekTime={(time) => {
            const clampedTime = Math.max(0, Math.min(time, duration || 30));
            setSeekTime(clampedTime);
          }}
          appTime={appTime}
        />
        <Player
          activeSong={activeSong}
          volume={volume}
          isPlaying={isPlaying}
          seekTime={seekTime}
          repeat={repeat}
          currentIndex={currentIndex}
          onEnded={handleNextSong}
          onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
          onLoadedData={(event) => setDuration(event.target.duration)}
        />
      </div>
      <div className="w-1/3 flex justify-end">
        <VolumeBar value={volume} min="0" max="1" onChange={(event) => setVolume(event.target.value)} setVolume={setVolume} />
      </div>
    </div>
  );
};

export default MusicPlayer;
