import React, { useState, useEffect } from 'react';

import api from '../api';

const MusicianSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
  setIsLoading(true);
  
  api.get('/musicians/search', { params: { q: query } })
    .then(res => {
      setResults(res.data); 
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Search error:', error);
      setIsLoading(false);
      setResults([]);
    });

    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Поиск музыканта по имени..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {isLoading && (
        <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-md">
          <div className="p-3 text-gray-500">Загрузка...</div>
        </div>
      )}
      
      {!isLoading && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-b-md border border-gray-200 max-h-60 overflow-y-auto">
          {results.map(musician => (
            <li 
              key={musician.id}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex justify-between items-center"
              onClick={() => {
                onSelect(musician);
                setQuery('');
                setResults([]);
              }}
            >
              <span className="font-medium">{musician.name}</span>
              <span className="text-sm text-gray-500">
                {musician.roles?.join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MusicianSearch;