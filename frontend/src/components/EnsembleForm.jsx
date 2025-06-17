import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewEnsemble } from '../features/ensembleSlice';
import MusicianSearch from './MusicianSearch';

const EnsembleForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    formationDate: '',
    type: '',
    members: [{ musician: null, role: '', startDate: '' }]
  });
  
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

   

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Очистка ошибки при изменении
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    
    setFormData({
      ...formData,
      members: newMembers
    });
    
    // Очистка ошибки при изменении
    const errorKey = `members.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addMemberField = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { musician: null, role: '', startDate: '' }]
    });
  };

  const removeMemberField = (index) => {
    if (formData.members.length > 1) {
      const newMembers = [...formData.members];
      newMembers.splice(index, 1);
      
      // Удаление связанных ошибок
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`members.${index}`)) {
          delete newErrors[key];
        }
      });
      
      setErrors(newErrors);
      setFormData({
        ...formData,
        members: newMembers
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Проверка обязательных полей
  if (!formData.name.trim() || !formData.type || !formData.formationDate) {
    setErrors({
      name: !formData.name.trim() ? 'Название ансамбля обязательно' : '',
      type: !formData.type ? 'Выберите тип ансамбля' : '',
      formationDate: !formData.formationDate ? 'Дата основания обязательна' : ''
    });
    return;
  }
  
  // Проверка участников
  const memberErrors = {};
  formData.members.forEach((member, index) => {
    if (!member.musician) {
      memberErrors[`members.${index}.musician`] = 'Выберите музыканта';
    }
    if (!member.role.trim()) {
      memberErrors[`members.${index}.role`] = 'Укажите роль';
    }
    if (!member.startDate) {
      memberErrors[`members.${index}.startDate`] = 'Укажите дату вступления';
    }
  });
  
  if (Object.keys(memberErrors).length > 0) {
    setErrors(memberErrors);
    return;
  }
  
  try {
    // Подготовка данных
    const payload = {
      name: formData.name,
      formationDate: formData.formationDate,
      type: formData.type,
      members: formData.members.map(member => ({
        musicianId: member.musician.id,
        role: member.role,
        startDate: member.startDate
      }))
    };
    
    await dispatch(addNewEnsemble(payload));
    
    // Успешное сохранение
    setSubmitStatus('success');
    setFormData({
      name: '',
      formationDate: '',
      type: '',
      members: [{ musician: null, role: '', startDate: '' }]
    });
    setErrors({});
    
    // Сброс сообщения через 3 секунды
    setTimeout(() => setSubmitStatus(null), 3000);
    
  } catch (error) {
    setSubmitStatus('error');
    console.error('Ошибка при создании ансамбля:', error);
    
    // Показать ошибку сервера
    setErrors({
      server: error.response?.data?.error || 'Произошла ошибка при добавлении ансамбля'
    });
  }
};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Добавить новый ансамбль</h2>
      
      {submitStatus === 'success' && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Ансамбль успешно добавлен!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Произошла ошибка при добавлении ансамбля
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Название ансамбля *
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
            placeholder="Введите название ансамбля"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="type">
            Тип ансамбля *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Выберите тип</option>
            <option value="ORCHESTRA">Оркестр</option>
            <option value="QUARTET">Квартет</option>
            <option value="BAND">Группа</option>
            <option value="CHOIR">Хор</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="formationDate">
            Дата основания *
          </label>
          <input
            type="date"
            id="formationDate"
            name="formationDate"
            value={formData.formationDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.formationDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.formationDate && <p className="text-red-500 text-sm mt-1">{errors.formationDate}</p>}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Участники ансамбля *</h3>
          
          {formData.members.map((member, index) => (
            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50 relative">
              {formData.members.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMemberField(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
                  title="Удалить участника"
                >
                  &times;
                </button>
              )}
              
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">
                  Музыкант *
                </label>
                {member.musician ? (
                  <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <div>
                      <span className="font-medium">{member.musician.name}</span>
                      {member.musician.roles && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({member.musician.roles.join(', ')})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMemberChange(index, 'musician', null)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Изменить
                    </button>
                  </div>
                ) : (
                  <MusicianSearch 
                    onSelect={(musician) => handleMemberChange(index, 'musician', musician)} 
                  />
                )}
                {errors[`members.${index}.musician`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`members.${index}.musician`]}</p>
                )}
              </div>
              
              <div className="mb-3">
                <label className="block text-gray-700 mb-1" htmlFor={`role-${index}`}>
                  Роль в ансамбле *
                </label>
                <input
                  type="text"
                  id={`role-${index}`}
                  value={member.role}
                  onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors[`members.${index}.role`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Например: Гитарист, Вокалист"
                />
                {errors[`members.${index}.role`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`members.${index}.role`]}</p>
                )}
              </div>
              
              <div className="mb-3">
                <label className="block text-gray-700 mb-1" htmlFor={`startDate-${index}`}>
                  Дата вступления *
                </label>
                <input
                  type="date"
                  id={`startDate-${index}`}
                  value={member.startDate}
                  onChange={(e) => handleMemberChange(index, 'startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors[`members.${index}.startDate`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors[`members.${index}.startDate`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`members.${index}.startDate`]}</p>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addMemberField}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Добавить участника
          </button>
          
          {errors.members && (
            <p className="text-red-500 text-sm mt-2">{errors.members}</p>
          )}
          {errors.server && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {errors.server}
            </div>
            )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
        >
          Сохранить ансамбль
        </button>
      </form>
    </div>
  );
};

export default EnsembleForm;