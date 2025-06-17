import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMusicians } from '../features/musicianSlice';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

const MusicianList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.musicians);

  useEffect(() => {
    dispatch(fetchMusicians());
  }, [dispatch]);

  if (status === 'loading') {
    return <LoadingSpinner text="Загрузка музыкантов..." />;
  }

  if (status === 'failed') {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Музыканты</h2>
          <Link 
            to="/add-musician" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Добавить музыканта
          </Link>
        </div>
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          <p className="font-medium">Ошибка загрузки данных:</p>
          <p className="mb-3">{error}</p>
          <button
            onClick={() => dispatch(fetchMusicians())}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Музыканты</h2>
        <Link 
          to="/add-musician" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить музыканта
        </Link>
      </div>
      
      {list.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Страна</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Роли</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Дата рождения</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.map(musician => (
                <tr key={musician.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {musician.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {musician.country || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {musician.roles?.join(', ') || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {musician.birthDate 
                      ? new Date(musician.birthDate).toLocaleDateString() 
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/musician/${musician.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Просмотр
                    </Link>
                    <Link 
                      to={`/edit-musician/${musician.id}`}
                      className="text-green-600 hover:text-green-800"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-block bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">Музыканты не найдены</h3>
          <p className="text-gray-500 mt-2 mb-6">
            В базе данных нет зарегистрированных музыкантов
          </p>
          <Link 
            to="/add-musician" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Добавить первого музыканта
          </Link>
        </div>
      )}
    </div>
  );
};

export default MusicianList;