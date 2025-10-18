import React, { useState, useEffect } from 'react';

const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Update local value when appTime changes (but not when user is dragging)
  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  // converts the time to format 0:00
  const getTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleInput = (event) => {
    const newValue = parseFloat(event.target.value);
    setLocalValue(newValue);
    onInput(event);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeekBack = () => {
    const newTime = Math.max(0, appTime - 5);
    setSeekTime(newTime);
  };

  const handleSeekForward = () => {
    const newTime = Math.min(max || 30, appTime + 5);
    setSeekTime(newTime);
  };

  // Ensure we have valid values
  const currentTime = isDragging ? localValue : (value || 0);
  const maxTime = max || 30;
  const minTime = parseFloat(min) || 0;

  return (
    <div className="hidden sm:flex flex-row items-center">
      <button 
        type="button" 
        onClick={handleSeekBack} 
        className="hidden lg:mr-4 lg:block text-white hover:text-gray-300 transition-colors"
        disabled={currentTime <= minTime}
      >
        -
      </button>
      <p className="text-white text-sm min-w-[2.5rem] text-right">
        {getTime(currentTime)}
      </p>
      <input
        type="range"
        step="0.1"
        value={currentTime}
        min={minTime}
        max={maxTime}
        onInput={handleInput}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        className="w-64 h-1 mx-4 rounded-lg cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((currentTime / maxTime) * 100)}%, #374151 ${((currentTime / maxTime) * 100)}%, #374151 100%)`
        }}
      />
      <p className="text-white text-sm min-w-[2.5rem]">
        {getTime(maxTime)}
      </p>
      <button 
        type="button" 
        onClick={handleSeekForward} 
        className="hidden lg:ml-4 lg:block text-white hover:text-gray-300 transition-colors"
        disabled={currentTime >= maxTime}
      >
        +
      </button>
    </div>
  );
};

export default Seekbar;
