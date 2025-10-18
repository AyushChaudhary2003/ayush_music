import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Error, Loader, SongCard } from '../components';
import { useSearchSongsQuery } from '../redux/services/appleMusicApi';

const Search = () => {
  const { searchTerm } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  
  // Use the dedicated search API
  const { data: searchResults, isFetching, error } = useSearchSongsQuery(searchTerm, {
    skip: !searchTerm || searchTerm.trim().length === 0
  });

  if (!searchTerm || searchTerm.trim().length === 0) {
    return (
      <div className="flex flex-col px-2">
        <h2 className="font-bold text-3xl text-white text-left mt-1 mb-4">Search</h2>
        <p className="text-gray-300">Enter a search term to find songs...</p>
      </div>
    );
  }

  if (isFetching) return <Loader title={`Searching for "${searchTerm}"...`} />;

  if (error && !searchResults) return <Error />;

  return (
    <div className="flex flex-col px-2">
      <div className="mb-6">
        <h2 className="font-bold text-3xl text-white text-left mt-1 mb-2">
          Search Results
        </h2>
        <p className="text-gray-300">
          {searchResults?.length > 0 
            ? `Found ${searchResults.length} songs for "${searchTerm}"`
            : `No songs found for "${searchTerm}"`
          }
        </p>
      </div>

      {searchResults?.length > 0 ? (
        <div className="flex flex-wrap sm:justify-start justify-center gap-6">
          {searchResults.map((song, i) => (
            <SongCard
              key={song.key}
              song={song}
              isPlaying={isPlaying}
              activeSong={activeSong}
              data={searchResults}
              i={i}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
          <p className="text-center max-w-md">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;