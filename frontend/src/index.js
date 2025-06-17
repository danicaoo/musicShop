import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import albumReducer from './features/albumSlice';
import musicianReducer from './features/musicianSlice';
import ensembleReducer from './features/ensembleSlice';
import inventoryReducer from './features/inventorySlice';
import recordingReducer from './features/recordingSlice'; // Добавлен импорт
import compositionReducer from './features/compositionSlice'; // Добавьте импорт


const store = configureStore({
  reducer: {
    albums: albumReducer,
    musicians: musicianReducer,
    ensembles: ensembleReducer,
    inventory: inventoryReducer,
    recordings: recordingReducer,// Добавлен редюсер записей
    compositions: compositionReducer // Добавьте этот редюсер

  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);