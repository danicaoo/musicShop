import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TopAlbums from './components/TopAlbums';
import AlbumList from './components/AlbumList';
import MusicianList from './components/MusicianList';
import AlbumDetails from './components/AlbumDetails';
import MusicianDetails from './components/MusicianDetails';
import AlbumForm from './components/AlbumForm';
import EnsembleForm from './components/EnsembleForm';
import SalesDashboard from './components/SalesDashboard';
import AddMusicianForm from './components/AddMusicianForm';
import EditMusicianForm from './components/EditMusicianForm';
import EnsembleList from './components/EnsembleList'; 
import EnsembleDetails from './components/EnsembleDetails'; // новый импорт
import CompositionList from './components/CompositionList'; // Добавлен импорт
import CompositionForm from './components/CompositionForm'; // Добавлен импорт
import RecordingList from './components/RecordingList'; // Добавлен импорт
import RecordingForm from './components/RecordingForm';



const Navigation = () => {
  const location = useLocation();
  const navLinks = [
    { path: '/', label: 'Топ продаж' },
    { path: '/albums', label: 'Альбомы' },
    { path: '/musicians', label: 'Музыканты' },
    { path: '/ensembles', label: 'Ансамбли' },
    { path: '/sales', label: 'Продажи' },
    { path: '/add-ensemble', label: 'Добавить ансамбль' },
    { path: '/compositions', label: 'Композиции' },
    { path: '/recordings', label: 'Записи' },
  ];

  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap gap-4 md:gap-6">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`px-3 py-2 rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-gray-900 text-white shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Музыкальный магазин - Управление базой данных
            </h1>
          </div>
          <Navigation />
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TopAlbums />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/musicians" element={<MusicianList />} />
            <Route path="/sales" element={<SalesDashboard />} />
            <Route path="/add-ensemble" element={<EnsembleForm />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="/musician/:id" element={<MusicianDetails />} />
            <Route path="/add-album" element={<AlbumForm />} />
            <Route path="/add-musician" element={<AddMusicianForm />} />
            <Route path="/edit-musician/:id" element={<EditMusicianForm />} />
            <Route path="/musician/:id" element={<MusicianDetails />} />
            <Route path="/ensembles" element={<EnsembleList />} />
            <Route path="/ensemble/:id" element={<EnsembleDetails />} />
            
            {/* Новые роуты для управления композициями и записями */}
            <Route path="/compositions" element={<CompositionList />} />
            <Route path="/add-composition" element={<CompositionForm />} />
            <Route path="/recordings" element={<RecordingList />} />
            <Route path="/add-recording" element={<RecordingForm />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>© 2024 Музыкальный магазин. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

const NotFound = () => (
  <div className="text-center py-16">
    <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
    <h2 className="text-2xl font-medium text-gray-700 mb-2">Страница не найдена</h2>
    <p className="text-gray-500 mb-8">
      Запрошенная страница не существует или была перемещена
    </p>
    <Link 
      to="/" 
      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Вернуться на главную
    </Link>
  </div>
);

export default App;