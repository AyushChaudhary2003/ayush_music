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
    if (ref.current && audioSrc) {
      const audio = ref.current;
      
      // Only update if the source actually changed
      if (audioSrc !== currentSrc) {
        // Safely pause and reset
        if (!audio.paused) {
          audio.pause();
        }
        
        // Reset states
        setHasError(false);
        audio.currentTime = 0;
        
        // Update source immediately
        audio.src = audioSrc;
        setCurrentSrc(audioSrc);
        
        // Load the new audio
        audio.load();
      }
    }
  }, [audioSrc, currentSrc]);

  // Effect to handle play/pause
  useEffect(() => {
    if (ref.current && audioSrc && !hasError) {
      const audio = ref.current;
      
      if (isPlaying) {
        const attemptPlay = async () => {
          try {
            // Wait for audio to be ready
            if (audio.readyState >= 1) { // HAVE_METADATA or higher
              await audio.play();
            } else {
              // Set up event listener for when audio is ready
              const handleCanPlay = async () => {
                audio.removeEventListener('canplaythrough', handleCanPlay);
                try {
                  await audio.play();
                } catch (playError) {
                  console.log('Playback failed:', playError);
                  setHasError(true);
                }
              };
              audio.addEventListener('canplaythrough', handleCanPlay);
              
              // Fallback timeout
              setTimeout(() => {
                audio.removeEventListener('canplaythrough', handleCanPlay);
              }, 3000);
            }
          } catch (error) {
            console.log('Play attempt failed:', error);
            setHasError(true);
          }
        };
        
        attemptPlay();
      } else {
        // Pause audio
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
    // Call onEnded to trigger next song (repeat mode is handled by loop attribute)
    if (onEnded && !repeat) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        onEnded();
      }, 100);
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
