/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect, useState } from 'react';

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {
  const ref = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  
  // Get the audio source - try preview URL first, then hub actions
  const audioSrc = activeSong?.previewUrl || activeSong?.hub?.actions?.[1]?.uri || '';
  
  // Effect to handle audio source changes
  useEffect(() => {
    if (ref.current && audioSrc && audioSrc !== currentSrc) {
      const audio = ref.current;
      
      // Safely pause and reset
      if (!audio.paused) {
        audio.pause();
      }
      
      // Wait a bit before changing source to avoid race conditions
      setTimeout(() => {
        if (audio && audio.src !== audioSrc) { // Check if we need to update source
          audio.currentTime = 0;
          audio.src = audioSrc;
          setCurrentSrc(audioSrc);
          setHasError(false);
          audio.load();
        }
      }, 50);
    }
  }, [audioSrc, currentSrc]);

  // Effect to handle play/pause
  useEffect(() => {
    if (ref.current && audioSrc) {
      const audio = ref.current;
      
      if (isPlaying && !hasError) {
        // Wait for the audio to be ready before playing
        const attemptPlay = async () => {
          try {
            if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
              await audio.play();
            } else {
              // Wait for audio to load first
              const handleCanPlay = () => {
                audio.removeEventListener('canplay', handleCanPlay);
                audio.play().catch((error) => {
                  console.log('Delayed playback failed:', error);
                  setHasError(true);
                });
              };
              audio.addEventListener('canplay', handleCanPlay);
            }
          } catch (error) {
            console.log('Playback failed:', error);
            setHasError(true);
          }
        };
        
        attemptPlay();
      } else {
        // Only pause if currently playing to avoid AbortError
        if (!audio.paused) {
          audio.pause();
        }
      }
    }
  }, [isPlaying, hasError, audioSrc]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current && !isNaN(seekTime) && seekTime !== ref.current.currentTime) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Reset when active song changes completely
  useEffect(() => {
    setHasError(false);
    setCurrentSrc('');
  }, [activeSong?.key, activeSong?.title]);

  const handleError = (error) => {
    console.log('Audio error:', error);
    setHasError(true);
  };

  const handleCanPlay = () => {
    setHasError(false);
    if (onLoadedData) {
      onLoadedData({ target: ref.current });
    }
  };

  const handleLoadedMetadata = () => {
    if (onLoadedData && ref.current) {
      onLoadedData({ target: ref.current });
    }
  };

  const handleEnded = () => {
    // Only call onEnded if not in repeat mode (loop handles repeat)
    if (onEnded) {
      onEnded();
    }
  };

  if (!audioSrc) {
    return null;
  }

  return (
    <audio
      ref={ref}
      loop={repeat}
      onEnded={handleEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={handleLoadedMetadata}
      onCanPlay={handleCanPlay}
      onError={handleError}
      preload="metadata"
      crossOrigin="anonymous"
    />
  );
};

export default Player;
