import React, { useState, useEffect } from 'react';
import { searchMusicians } from '../services/musicianService';
import { toast } from 'react-hot-toast';

const MusicianSelector = ({ onSelect, selected, onClear }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Инициализация при получении выбранного музыканта
  useEffect(() => {
    if (selected) {
      setQuery(selected.name);
    }
  }, [selected]);

  // Поиск с задержкой и защитой от коротких запросов
  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const data = await searchMusicians(query);
        setResults(data);
      } catch (error) {
        // Игнорируем ошибку короткого запроса
        if (!error.includes('Query must be at least 2 characters')) {
          toast.error('Ошибка поиска музыкантов');
          console.error('Search error:', error);
        }
      } finally {
        setIsSearching(false);
      }
    };
    
    // Задержка для уменьшения количества запросов
    const timer = setTimeout(() => {
      search();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (musician) => {
    onSelect(musician);
    setResults([]);
  };

  return (
    <div className="relative">
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск музыканта..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onClear}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300"
        >
          Очистить
        </button>
      </div>
      
      {isSearching && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-3 text-center text-gray-600">Поиск...</div>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map(musician => (
            <div
              key={musician.id}
              className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(musician)}
            >
              <div className="font-medium">{musician.name}</div>
              <div className="text-sm text-gray-600">
                {musician.country} • {musician.roles?.join(', ')}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selected && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="font-medium">Выбрано:</div>
          <div className="flex justify-between items-center mt-1">
            <div>
              {selected.name} 
              {selected.roles?.length > 0 && (
                <span className="ml-2 text-gray-600">({selected.roles.join(', ')})</span>
              )}
            </div>
            <button
              onClick={onClear}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicianSelector;