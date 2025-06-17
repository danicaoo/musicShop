import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewComposition } from '../features/compositionSlice';
import { toast } from 'react-hot-toast';

const CompositionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    creationYear: '',
    genre: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Название обязательно';
    if (!formData.duration) newErrors.duration = 'Длительность обязательна';
    if (!formData.creationYear) newErrors.creationYear = 'Год создания обязателен';
    
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
      
      // Преобразование данных
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        creationYear: parseInt(formData.creationYear),
        genre: formData.genre ? formData.genre.split(',').map(g => g.trim()) : []
      };
      
      await dispatch(addNewComposition(payload)).unwrap();
      
      toast.success('Композиция успешно добавлена!');
      setTimeout(() => {
        navigate('/compositions');
      }, 1500);
    } catch (error) {
      console.error('Composition creation error:', error);
      toast.error(`Ошибка при добавлении композиции: ${error.message || 'Неизвестная ошибка'}`);
      setErrors({ server: error.message || 'Ошибка при добавлении композиции' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Добавить новую композицию</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
              Название композиции *
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
              placeholder="Введите название композиции"
            />
            {errors.title && <p className="mt-1 text-red-500 text-sm">{errors.title}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="duration">
                Длительность (секунды) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Например, 240"
              />
              {errors.duration && <p className="mt-1 text-red-500 text-sm">{errors.duration}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2" htmlFor="creationYear">
                Год создания *
              </label>
              <input
                type="number"
                id="creationYear"
                name="creationYear"
                value={formData.creationYear}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.creationYear ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Например, 2020"
              />
              {errors.creationYear && <p className="mt-1 text-red-500 text-sm">{errors.creationYear}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="genre">
              Жанры (через запятую)
            </label>
            <input
              type="text"
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например, Rock, Pop, Jazz"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/compositions')}
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
            {isSubmitting ? 'Сохранение...' : 'Сохранить композицию'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompositionForm;