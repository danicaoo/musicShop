import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlbums, searchAlbumCatalog } from '../features/albumSlice';
import { Link } from 'react-router-dom';

const AlbumList = () => {
  const dispatch = useDispatch();
  const { list, searchResults, status, error, pagination } = useSelector(state => state.albums);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const albumsToShow = searchQuery.trim() ? searchResults : list;

  useEffect(() => {
    dispatch(fetchAlbums(currentPage));
  }, [dispatch, currentPage]);

// В AlbumList.jsx
const handleSearch = (e) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    dispatch(searchAlbumCatalog(searchQuery))
      .unwrap()
      .catch(error => {
        console.error('Search failed:', error);
        // Показать сообщение об ошибке пользователю
      });
  } else {
    dispatch(fetchAlbums());
  }
};

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (status === 'loading') return <div className="text-center py-8">Загрузка альбомов...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Ошибка: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Каталог альбомов</h2>
        <Link 
          to="/add-album" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить альбом
        </Link>
      </div>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или каталожному номеру..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
          >
            Найти
          </button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albumsToShow.map(album => (
          <div key={album.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{album.title}</h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Каталожный номер:</span> {album.catalogNumber}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Дата выпуска:</span> {new Date(album.releaseDate).toLocaleDateString()}
              </p>
              
              {album.inventories?.length > 0 && (
                <div className="mt-4 bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-gray-700">
                    <span className="font-medium">Розничная цена:</span> ${album.inventories[0].retailPrice.toFixed(2)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Продано в этом году:</span> {album.inventories[0].currentYearSales}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Остаток:</span> {album.inventories[0].unsold}
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Link 
                  to={`/album/${album.id}`} 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Подробнее &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {albumsToShow.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Альбомы не найдены. {searchQuery.trim() ? 'Попробуйте изменить запрос.' : 'Добавьте первый альбом в каталог.'}
        </div>
      )}
      
      {!searchQuery.trim() && pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            {currentPage > 1 && (
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Назад
              </button>
            )}
            
            {[...Array(pagination.totalPages).keys()].map(page => (
              <button
                key={page + 1}
                onClick={() => handlePageChange(page + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page + 1 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {page + 1}
              </button>
            ))}
            
            {currentPage < pagination.totalPages && (
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Вперед
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumList;