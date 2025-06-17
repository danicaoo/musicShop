import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { modifyMusician } from '../features/musicianSlice';

const EditMusicianForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { list } = useSelector(state => state.musicians);
  
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    country: '',
    bio: '',
    roles: []
  });
  
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validRoles = ['VOCALIST', 'GUITARIST', 'BASSIST', 'DRUMMER', 'KEYBOARDIST', 'COMPOSER', 'CONDUCTOR', 'PRODUCER'];

  // Загрузка данных музыканта
  useEffect(() => {
    const musician = list.find(m => m.id === parseInt(id));
    if (musician) {
      setFormData({
        name: musician.name,
        birthDate: musician.birthDate ? musician.birthDate.split('T')[0] : '',
        country: musician.country || '',
        bio: musician.bio || '',
        roles: musician.roles || []
      });
    }
  }, [id, list]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => {
      const newRoles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      
      return { ...prev, roles: newRoles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Имя обязательно';
    if (formData.roles.length === 0) newErrors.roles = 'Выберите хотя бы одну роль';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await dispatch(modifyMusician({
        id: parseInt(id),
        data: {
          ...formData,
          birthDate: formData.birthDate || null
        }
      }));
      
      setSubmitStatus('success');
      setTimeout(() => {
        navigate(`/musician/${id}`);
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ server: error.message });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Редактировать музыканта</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Данные музыканта успешно обновлены!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {errors.server || 'Произошла ошибка при обновлении данных'}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Полное имя *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Введите полное имя музыканта"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="birthDate">
            Дата рождения
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="country">
            Страна
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите страну"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Роли *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {validRoles.map(role => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role)}
                  onChange={() => handleRoleChange(role)}
                  className="mr-2 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{role}</span>
              </label>
            ))}
          </div>
          {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="bio">
            Биография
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Расскажите о музыканте..."
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/musician/${id}`)}
            className="flex-1 bg-gray-300 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Отмена
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Сохранить изменения
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMusicianForm;