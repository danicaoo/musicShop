import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewRecording } from '../features/recordingSlice';
import { fetchCompositions } from '../features/compositionSlice';
import { toast } from 'react-hot-toast';

const RecordingForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
const compositions = useSelector(state => state.compositions?.list || []);
  
  const [formData, setFormData] = useState({
    compositionId: '',
    recordingDate: '',
    studio: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCompositions());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.compositionId) newErrors.compositionId = 'Выберите композицию';
    if (!formData.recordingDate) newErrors.recordingDate = 'Дата записи обязательна';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const payload = {
        ...formData,
        recordingDate: new Date(formData.recordingDate).toISOString()
      };
      
      await dispatch(addNewRecording(payload)).unwrap();
      
      toast.success('Запись успешно добавлена!');
      setTimeout(() => {
        navigate('/recordings');
      }, 1500);
    } catch (error) {
      console.error('Recording creation error:', error);
      toast.error(`Ошибка при добавлении записи: ${error.message || 'Неизвестная ошибка'}`);
      setErrors({ server: error.message || 'Ошибка при добавлении записи' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Добавить новую запись</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="compositionId">
              Композиция *
            </label>
            <select
              id="compositionId"
              name="compositionId"
              value={formData.compositionId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.compositionId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            >
              <option value="">Выберите композицию</option>
              {compositions.map(comp => (
                <option key={comp.id} value={comp.id}>
                  {comp.title}
                </option>
              ))}
            </select>
            {errors.compositionId && <p className="mt-1 text-red-500 text-sm">{errors.compositionId}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="recordingDate">
              Дата записи *
            </label>
            <input
              type="date"
              id="recordingDate"
              name="recordingDate"
              value={formData.recordingDate}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.recordingDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.recordingDate && <p className="mt-1 text-red-500 text-sm">{errors.recordingDate}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="studio">
              Студия записи
            </label>
            <input
              type="text"
              id="studio"
              name="studio"
              value={formData.studio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите название студии"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/recordings')}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить запись'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordingForm;