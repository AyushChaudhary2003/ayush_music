import React from 'react';
import { BsFillVolumeUpFill, BsVolumeDownFill, BsFillVolumeMuteFill } from 'react-icons/bs';

const VolumeBar = ({ value, min, max, onChange, setVolume }) => (
  <div className="hidden lg:flex items-center justify-end w-40">
    <div className="cursor-pointer mr-2">
      {value <= 1 && value > 0.5 && <BsFillVolumeUpFill size={20} color="#FFF" onClick={() => setVolume(0)} />}
      {value <= 0.5 && value > 0 && <BsVolumeDownFill size={20} color="#FFF" onClick={() => setVolume(0)} />}
      {value === 0 && <BsFillVolumeMuteFill size={20} color="#FFF" onClick={() => setVolume(1)} />}
    </div>
    <input
      type="range"
      step="any"
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      className="w-24 h-1"
    />
  </div>
);

export default VolumeBar;
