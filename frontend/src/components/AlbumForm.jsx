import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewAlbum } from '../features/albumSlice';
import { fetchRecordings } from '../features/recordingSlice';
import EnsembleSearch from './EnsembleSearch';
import RecordingSearch from './RecordingSearch';
import MusicianSelector from './MusicianSelector';
import LoadingSpinner from './LoadingSpinner';
import { toast } from 'react-hot-toast';


const AlbumForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Получаем записи из Redux store
  const recordings = useSelector(state => state.recordings.list);
  const recordingsStatus = useSelector(state => state.recordings.status);
  const recordingsError = useSelector(state => state.recordings.error);
  
  const [formData, setFormData] = useState({
    title: '',
    catalogNumber: '',
    releaseDate: '',
  });
  
  const [tracks, setTracks] = useState([{ position: 1, recording: null }]);
  const [selectedMusician, setSelectedMusician] = useState(null);
  const [selectedEnsemble, setSelectedEnsemble] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inventoryData, setInventoryData] = useState({
  wholesalePrice: '',
  retailPrice: '',
  initialQuantity: ''
});
  
  // Загрузка записей при монтировании компонента
  useEffect(() => {
    if (recordingsStatus === 'idle') {
      dispatch(fetchRecordings());
    }
  }, [dispatch, recordingsStatus]);

  // Обработка ошибок загрузки записей
  useEffect(() => {
    if (recordingsError) {
      console.error('Failed to fetch recordings', recordingsError);
      toast.error('Не удалось загрузить записи');
      setErrors(prev => ({ ...prev, recordings: 'Не удалось загрузить записи' }));
    }
  }, [recordingsError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTrackChange = (index, field, value) => {
    const newTracks = [...tracks];
    newTracks[index][field] = value;
    setTracks(newTracks);
  };

  const addTrack = () => {
    setTracks([...tracks, { position: tracks.length + 1, recording: null }]);
  };

  const removeTrack = (index) => {
    if (tracks.length > 1) {
      const newTracks = tracks.filter((_, i) => i !== index)
        .map((track, i) => ({ ...track, position: i + 1 }));
      setTracks(newTracks);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Проверка основных полей
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (!formData.catalogNumber.trim()) newErrors.catalogNumber = 'Каталожный номер обязателен';
    if (!formData.releaseDate) newErrors.releaseDate = 'Дата выпуска обязательна';
    
    // Проверка исполнителя
    if (!selectedMusician && !selectedEnsemble) {
      newErrors.performer = 'Выберите сольного исполнителя или ансамбль';
    }
    
    // Проверка треков
    const invalidTracks = tracks.some(track => !track.recording);
    if (invalidTracks) newErrors.tracks = 'Для всех треков нужно выбрать запись';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
    
  // Валидация формы
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  try {
    setIsSubmitting(true);
    
    const payload = {
      title: formData.title,
      catalogNumber: formData.catalogNumber,
      releaseDate: formData.releaseDate,
      tracks: tracks.map(track => ({
        position: track.position,
        recordingId: track.recording.id
      })),
      inventoryData: {
        wholesalePrice: parseFloat(inventoryData.wholesalePrice),
        retailPrice: parseFloat(inventoryData.retailPrice),
        initialQuantity: parseInt(inventoryData.initialQuantity)
      }
    };
    
    if (selectedMusician) payload.musicianId = selectedMusician.id;
    if (selectedEnsemble) payload.ensembleId = selectedEnsemble.id;
    
    await dispatch(addNewAlbum(payload)).unwrap();
      
    toast.success('Альбом успешно добавлен!');
    setTimeout(() => {
      navigate('/albums');
    }, 1500);
  } catch (error) {
    console.error('Album creation error:', error);
    toast.error(`Ошибка при добавлении альбома: ${error.message || 'Неизвестная ошибка'}`);
    setErrors({ server: error.message || 'Ошибка при добавлении альбома' });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleInventoryChange = (e) => {
  const { name, value } = e.target;
  setInventoryData(prev => ({ ...prev, [name]: value }));
};




  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Добавить новый альбом</h2>
      
      {errors.server && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.server}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Название альбома *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Введите название альбома"
            />
            {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="catalogNumber">
              Каталожный номер *
            </label>
            <input
              type="text"
              id="catalogNumber"
              name="catalogNumber"
              value={formData.catalogNumber}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.catalogNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Пример: ABC-123"
            />
            {errors.catalogNumber && <p className="mt-1 text-red-500 text-sm">{errors.catalogNumber}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="releaseDate">
              Дата выпуска *
            </label>
            <input
              type="date"
              id="releaseDate"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.releaseDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.releaseDate && <p className="mt-1 text-red-500 text-sm">{errors.releaseDate}</p>}
          </div>
        </div>
        
        {/* Исполнитель */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Исполнитель *</h3>
          
          {errors.performer && (
            <p className="text-red-500 text-sm">{errors.performer}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Сольный исполнитель</label>
              <MusicianSelector 
                onSelect={(musician) => {
                  setSelectedMusician(musician);
                  setSelectedEnsemble(null);
                }}
                selected={selectedMusician}
                onClear={() => setSelectedMusician(null)}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Ансамбль</label>
              <EnsembleSearch 
                onSelect={(ensemble) => {
                  setSelectedEnsemble(ensemble);
                  setSelectedMusician(null);
                }}
                selected={selectedEnsemble}
                onClear={() => setSelectedEnsemble(null)}
              />
            </div>
          </div>
        </div>
        
        {/* Треки */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Треки альбома *</h3>
            {errors.tracks && <p className="text-red-500 text-sm">{errors.tracks}</p>}
          </div>
          
          {recordingsStatus === 'loading' ? (
            <LoadingSpinner text="Загрузка записей..." />
          ) : recordingsStatus === 'failed' ? (
            <div className="text-center py-4 text-red-500">
              Ошибка загрузки записей: {recordingsError}
            </div>
          ) : (
            <>
              {tracks.map((track, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                  <button
                    type="button"
                    onClick={() => removeTrack(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                    disabled={tracks.length <= 1}
                    aria-label="Удалить трек"
                  >
                    &times;
                  </button>
                  
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-1">Позиция</label>
                      <input
                        type="number"
                        value={track.position}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min="1"
                        disabled
                      />
                    </div>
                    
                    <div className="col-span-10">
                      <label className="block text-gray-700 mb-1">Запись *</label>
                      <RecordingSearch 
                        recordings={recordings}
                        onSelect={(recording) => handleTrackChange(index, 'recording', recording)}
                        selected={track.recording}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addTrack}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Добавить трек
              </button>
            </>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="wholesalePrice">
      Оптовая цена ($)
    </label>
    <input
      type="number"
      id="wholesalePrice"
      name="wholesalePrice"
      value={inventoryData.wholesalePrice}
      onChange={handleInventoryChange}
      min="0"
      step="0.01"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="0.00"
      required
    />
  </div>
  
  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="retailPrice">
      Розничная цена ($)
    </label>
    <input
      type="number"
      id="retailPrice"
      name="retailPrice"
      value={inventoryData.retailPrice}
      onChange={handleInventoryChange}
      min="0"
      step="0.01"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="0.00"
      required
    />
  </div>
  
  <div>
    <label className="block text-gray-700 font-medium mb-2" htmlFor="initialQuantity">
      Начальное количество
    </label>
    <input
      type="number"
      id="initialQuantity"
      name="initialQuantity"
      value={inventoryData.initialQuantity}
      onChange={handleInventoryChange}
      min="1"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="100"
      required
    />
  </div>
</div>

        {/* Кнопки отправки */}
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/albums')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting || recordingsStatus === 'loading'}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting || recordingsStatus === 'loading'
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить альбом'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlbumForm;