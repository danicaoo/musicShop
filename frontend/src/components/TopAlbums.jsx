import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopSellingAlbums } from '../features/albumSlice';
import LoadingSpinner from './LoadingSpinner';

const TopAlbums = () => {
  const dispatch = useDispatch();
  const { topSelling, status, error } = useSelector(state => state.albums);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTopSellingAlbums());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <LoadingSpinner text="Загрузка данных о продажах..." />;
  }

  if (error) {
    return (
      <div className="alert-error max-w-2xl mx-auto">
        <h3 className="font-bold">Ошибка загрузки</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Топ продаж текущего года</h2>
      </div>
      
      {topSelling.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Альбом</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Каталожный номер</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Ансамбль</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Продажи</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">Выручка</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topSelling.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-gray-600">{item.catalogNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{item.ensemble || '-'}</td>
                  <td className="px-6 py-4 text-right">{item.currentYearSales}</td>
                  <td className="px-6 py-4 text-right">${item.retailPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-semibold">
                    ${(item.currentYearSales * item.retailPrice).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan="4" className="px-6 py-4 text-right">Итого:</td>
                <td className="px-6 py-4 text-right">
                  {topSelling.reduce((sum, item) => sum + item.currentYearSales, 0)}
                </td>
                <td className="px-6 py-4 text-right">-</td>
                <td className="px-6 py-4 text-right">
                  ${topSelling.reduce(
                    (sum, item) => sum + (item.currentYearSales * item.retailPrice), 
                    0
                  ).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="p-12 text-center">
          <div className="inline-block bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">Данные о продажах отсутствуют</h3>
          <p className="text-gray-500 mt-2">Нет информации о продажах за текущий год</p>
        </div>
      )}
    </div>
  );
};

export default TopAlbums;