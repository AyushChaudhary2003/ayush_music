import React from 'react';
import { useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { useGetTopChartsQuery } from '../redux/services/appleMusicApi';

const AroundYou = () => {
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetTopChartsQuery();

  if (isFetching) return <Loader title="Loading Popular Songs..." />;

  if (error) return <Error />;

  return (
    <div className="flex flex-col px-2">
      <h2 className="font-bold text-3xl text-white text-left mt-1 mb-4">
        Popular <span className="font-black">Around You</span>
      </h2>

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

export default AroundYou;