import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetTopChartsQuery } from '../redux/services/appleMusicApi';

const Discover = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading songs..." />;

  // If there's an error but we have fallback data, use it
  if (error && !data) return <Error />;

  return (
    <div className="flex flex-col px-2">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-1 mb-4">
        <h2 className="font-bold text-3xl text-white text-left">Discover Music</h2>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-6">
        {data?.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;