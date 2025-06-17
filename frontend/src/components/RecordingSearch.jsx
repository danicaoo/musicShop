import React, { useState } from 'react';


const RecordingSearch = ({ recordings, onSelect, selected }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredRecordings = recordings.filter(recording => {
    if (!recording.composition) return false;
    
    return (
      recording.composition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recording.studio && recording.studio.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleSelect = (recording) => {
    onSelect(recording);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Поиск записи по названию композиции или студии..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {showResults && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredRecordings.length > 0 ? (
            filteredRecordings.map(recording => (
              <div
                key={recording.id}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(recording)}
              >
                <div className="font-medium">
                  {recording.composition.title}
                </div>
                <div className="text-sm text-gray-600">
                  {recording.studio && `Студия: ${recording.studio} • `}
                  {new Date(recording.recordingDate).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-500">
              {searchTerm ? 'Записи не найдены' : 'Введите запрос для поиска'}
            </div>
          )}
        </div>
      )}
      
      {selected && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="font-medium">Выбрано:</div>
          <div className="flex justify-between items-center mt-1">
            <div>
              {selected.composition.title}
              {selected.studio && ` (${selected.studio})`}
            </div>
            <button
              onClick={() => onSelect(null)}
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

export default RecordingSearch;