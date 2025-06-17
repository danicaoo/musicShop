import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllEnsembles } from '../features/ensembleSlice';
import LoadingSpinner from './LoadingSpinner';

const EnsembleList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.ensembles);

  useEffect(() => {
    dispatch(fetchAllEnsembles());
  }, [dispatch]);

  if (status === 'loading') {
    return <LoadingSpinner text="Загрузка ансамблей..." />;
  }

  if (status === 'failed') {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Ансамбли</h2>
          <Link 
            to="/add-ensemble" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Добавить ансамбль
          </Link>
        </div>
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          <p className="font-medium">Ошибка загрузки данных:</p>
          <p className="mb-3">{error}</p>
          <button
            onClick={() => dispatch(fetchAllEnsembles())}
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
        <h2 className="text-2xl font-bold text-gray-800">Ансамбли</h2>
        <Link 
          to="/add-ensemble" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить ансамбль
        </Link>
      </div>
      
      {list.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Дата основания</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Участники</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {list.map(ensemble => (
                <tr key={ensemble.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    <Link 
                      to={`/ensemble/${ensemble.id}`} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {ensemble.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {ensemble.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(ensemble.formationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {ensemble.members?.map(member => (
                        <span 
                          key={member.id} 
                          className="bg-gray-100 px-2 py-1 rounded text-xs"
                        >
                          {member.musician.name} ({member.role})
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-block bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">Ансамбли не найдены</h3>
          <p className="text-gray-500 mt-2 mb-6">
            В базе данных нет зарегистрированных ансамблей
          </p>
          <Link 
            to="/add-ensemble" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Добавить первый ансамбль
          </Link>
        </div>
      )}
    </div>
  );
};

export default EnsembleList;