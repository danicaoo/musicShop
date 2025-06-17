import React, { useState, useEffect } from 'react';
import api from '../api';

const EnsembleSearch = ({ onSelect, selected, onClear }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (query.length > 2) {
    setIsLoading(true);
    api.get('/ensembles/search', { params: { q: query } }) // новый эндпоинт
      .then(res => {
        setResults(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  } else {
    setResults([]);
  }
}, [query]);

  return (
    <div className="relative">
      {selected ? (
        <div className="flex justify-between items-center bg-white p-2 rounded border">
          <span className="font-medium">{selected.name}</span>
          <button
            type="button"
            onClick={onClear}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Изменить
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Поиск ансамбля по названию..."
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
              {results.map(ensemble => (
                <li 
                  key={ensemble.id}
                  className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    onSelect(ensemble);
                    setQuery('');
                    setResults([]);
                  }}
                >
                  {ensemble.name} ({ensemble.type})
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default EnsembleSearch;