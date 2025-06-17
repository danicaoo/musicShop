import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnsembleAlbums, fetchCompositionsCount } from '../features/ensembleSlice';
import LoadingSpinner from './LoadingSpinner';

const EnsembleDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  // Получаем ансамбль из списка
  const ensemble = useSelector(state => 
    state.ensembles.list.find(e => e.id === parseInt(id))
  );
  
  const { albums, compositionsCount, status } = useSelector(state => state.ensembles);

  useEffect(() => {
    if (id) {
      dispatch(fetchEnsembleAlbums(id));
      dispatch(fetchCompositionsCount(id));
    }
  }, [id, dispatch]);

  if (!ensemble) return <div className="text-center py-8">Ансамбль не найден</div>;
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{ensemble.name}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          <div>
            <span className="font-medium">Тип:</span> {ensemble.type}
          </div>
          <div>
            <span className="font-medium">Дата основания:</span> {new Date(ensemble.formationDate).toLocaleDateString()}
          </div>
          {ensemble.dissolutionDate && (
            <div>
              <span className="font-medium">Дата распада:</span> {new Date(ensemble.dissolutionDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Участники</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ensemble.members?.map(member => (
            <div key={member.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="font-medium">{member.musician.name}</div>
              <div className="text-gray-600">{member.role}</div>
              <div className="text-sm text-gray-500">
                {new Date(member.startDate).toLocaleDateString()} -{' '}
                {member.endDate ? new Date(member.endDate).toLocaleDateString() : 'н.в.'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Музыкальные произведения</h3>
          {status === 'loading' ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <p className="text-2xl font-bold">{compositionsCount?.count || 0}</p>
          )}
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Альбомы</h3>
          {status === 'loading' ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : albums.length > 0 ? (
            <ul className="space-y-1">
              {albums.map(album => (
                <li key={album.id} className="flex justify-between">
                  <span>{album.title}</span>
                  <span className="text-gray-500">{new Date(album.releaseDate).getFullYear()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Нет альбомов</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => window.history.back()}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
        >
          Назад
        </button>
      </div>
    </div>
  );
};

export default EnsembleDetails;