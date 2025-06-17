import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecordings } from '../features/recordingSlice';
import LoadingSpinner from './LoadingSpinner';

const RecordingList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.recordings);

  useEffect(() => {
    dispatch(fetchRecordings());
  }, [dispatch]);

  if (status === 'loading') return <LoadingSpinner text="Загрузка записей..." />;
  if (status === 'failed') return <div className="text-red-500">Ошибка: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Записи композиций</h2>
        <Link 
          to="/add-recording" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить запись
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Композиция
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата записи
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Студия
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map(recording => (
              <tr key={recording.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {recording.composition?.title || 'Неизвестная композиция'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(recording.recordingDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {recording.studio || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/recording/${recording.id}`}
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
      
      {list.length === 0 && status === 'succeeded' && (
        <div className="text-center py-8 text-gray-500">
          Записи не найдены. Добавьте первую запись.
        </div>
      )}
    </div>
  );
};

export default RecordingList;