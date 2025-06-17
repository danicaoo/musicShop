import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCompositions } from '../features/compositionSlice';
import LoadingSpinner from './LoadingSpinner';

const CompositionList = () => {
  const dispatch = useDispatch();
  

  const compositions = useSelector(state => state.compositions.list || []);
  const status = useSelector(state => state.compositions.status);
  const error = useSelector(state => state.compositions.error);

  useEffect(() => {
    dispatch(fetchCompositions());
  }, [dispatch]);

  // Добавляем проверку на пустой массив
  const hasCompositions = compositions.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Музыкальные композиции</h2>
        <Link 
          to="/add-composition" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить композицию
        </Link>
      </div>

      {status === 'loading' ? (
        <LoadingSpinner text="Загрузка композиций..." />
      ) : status === 'failed' ? (
        <div className="text-red-500">Ошибка: {error}</div>
      ) : !hasCompositions ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Композиции не найдены</p>
          <Link 
            to="/add-composition" 
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Добавить первую композицию
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Длительность
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Год создания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Жанр
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {compositions.map(composition => (
                <tr key={composition.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {composition.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {Math.floor(composition.duration / 60)}:{String(composition.duration % 60).padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {composition.creationYear || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {composition.genre || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/composition/${composition.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Подробнее
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompositionList;