import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSale, fetchSalesReport } from '../features/saleSlice';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchInventories } from '../features/inventorySlice';

const SalesDashboard = () => {
  const dispatch = useDispatch();
  
  // Получаем список инвентаря без неиспользуемой переменной status
  const inventories = useSelector(state => state.inventory.list);
  
  // Получаем данные о продажах
  const salesState = useSelector(state => state.sales);
  const report = salesState?.report;
  
  const [saleData, setSaleData] = useState({ inventoryId: '', quantity: 1 });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    minQuantity: 1
  });
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    // Загружаем инвентарь и отчет о продажах
    dispatch(fetchInventories());
    const loadInitialReport = async () => {
      setIsLoadingReport(true);
      try {
        await dispatch(fetchSalesReport(filters));
      } finally {
        setIsLoadingReport(false);
      }
    };
    
    loadInitialReport();
  }, [dispatch, filters]);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    setIsCreatingSale(true);
    
    try {
      await dispatch(createSale({
        inventoryId: parseInt(saleData.inventoryId),
        quantity: parseInt(saleData.quantity)
      }));
      toast.success('Продажа успешно зарегистрирована!');
      setSaleData({ inventoryId: '', quantity: 1 });
      
      // Обновляем отчет после новой продажи
      dispatch(fetchSalesReport(filters));
    } catch (error) {
      toast.error(`Ошибка: ${error.message || 'Не удалось зарегистрировать продажу'}`);
    } finally {
      setIsCreatingSale(false);
    }
  };

  const loadReport = async () => {
    setIsLoadingReport(true);
    try {
      await dispatch(fetchSalesReport(filters));
    } catch (error) {
      toast.error(`Ошибка загрузки отчета: ${error.message}`);
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Форматирование данных для графика
  const chartData = report?.sales?.map(sale => ({
    date: new Date(sale.saleDate).toLocaleDateString(),
    quantity: sale.quantity,
    revenue: sale.quantity * sale.inventory.retailPrice
  })) || [];

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Панель управления продажами</h1>
      
      {/* Ключевые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Общие продажи</h3>
          <p className="text-2xl font-bold">
            {report?.totalSales || 0}
          </p>
          <p className="text-sm text-gray-500">шт. за период</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Выручка</h3>
          <p className="text-2xl font-bold">
            ${report?.totalRevenue?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-500">за период</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">Средний чек</h3>
          <p className="text-2xl font-bold">
            {report?.sales?.length 
              ? `$${(report.totalRevenue / report.totalSales).toFixed(2)}` 
              : '$0.00'}
          </p>
          <p className="text-sm text-gray-500">за период</p>
        </div>
      </div>
      
      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка: Регистрация продаж */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Регистрация продажи</h2>
          
          <form onSubmit={handleCreateSale} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Инвентарь</label>
              <select
                value={saleData.inventoryId}
                onChange={e => setSaleData({...saleData, inventoryId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Выберите альбом</option>
                {inventories.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.album?.title} (Остаток: {item.unsold})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Количество</label>
              <input
                type="number"
                min="1"
                value={saleData.quantity}
                onChange={e => setSaleData({...saleData, quantity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isCreatingSale}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 ${
                isCreatingSale ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isCreatingSale ? 'Регистрация...' : 'Зарегистрировать продажу'}
            </button>
          </form>
        </div>
        
        {/* Правая колонка: Отчеты и аналитика */}
        <div className="lg:col-span-2 space-y-6">
          {/* Фильтры отчета */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Фильтры отчета</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Начальная дата</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={e => setFilters({...filters, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Конечная дата</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={e => setFilters({...filters, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Мин. количество</label>
                <input
                  type="number"
                  min="1"
                  value={filters.minQuantity}
                  onChange={e => setFilters({...filters, minQuantity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <button
              onClick={loadReport}
              disabled={isLoadingReport}
              className={`mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 ${
                isLoadingReport ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoadingReport ? 'Загрузка...' : 'Загрузить отчет'}
            </button>
          </div>
          
          {/* График продаж */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Динамика продаж</h2>
            <div className="h-72">
              {isLoadingReport ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, '']} />
                    <Legend />
                    <Bar dataKey="quantity" name="Количество" fill="#3b82f6" />
                    <Bar dataKey="revenue" name="Выручка ($)" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Нет данных для отображения
                </div>
              )}
            </div>
          </div>
          
          {/* Таблица продаж */}
          {!isLoadingReport && report?.sales?.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Детализация продаж</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Альбом</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sale.inventory.album.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sale.inventory.album.ensemble?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${sale.inventory.retailPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${(sale.quantity * sale.inventory.retailPrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;