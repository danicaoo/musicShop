import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';


export const fetchAlbums = createAsyncThunk(
  'albums/fetchAll',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get('/albums', { params: { page } });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAlbumDetails = createAsyncThunk(
  'albums/fetchDetails',
  async (id) => {
    const response = await api.get(`/albums/${id}`);
    return response.data;
  }
);

export const addNewAlbum = createAsyncThunk(
  'albums/addNew',
  async (albumData, { rejectWithValue }) => {
    try {
      const response = await api.post('/albums', albumData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 
        error.message || 
        'Неизвестная ошибка при создании альбома'
      );
    }
  }
);
export const modifyAlbum = createAsyncThunk(
  'albums/update',
  async ({ id, data }) => {
    const response = await api.put(`/albums/${id}`, data);
    return response.data;
  }
);
// В fetchTopSellingAlbums
export const fetchTopSellingAlbums = createAsyncThunk(
  'albums/fetchTopSelling',
  async () => {
    const response = await api.get('/top-selling'); // Корректный путь
    return response.data;
  }
);
export const searchAlbumCatalog = createAsyncThunk(
  'albums/search',
  async (query) => {
    const response = await api.get('/albums/search', {  // Исправленный URL
      params: { q: query }
    });
    return response.data;
  }
);

// Slice
const albumSlice = createSlice({
  name: 'albums',
  initialState: {
    list: [],
    currentAlbum: null,
    searchResults: [],
    topSelling: [],
    status: 'idle',
    error: null,
    pagination: {}
  },
  reducers: {
    clearCurrentAlbum: (state) => {
      state.currentAlbum = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchAlbumDetails.fulfilled, (state, action) => {
        state.currentAlbum = action.payload;
      })
      .addCase(addNewAlbum.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(modifyAlbum.fulfilled, (state, action) => {
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentAlbum?.id === action.payload.id) {
          state.currentAlbum = action.payload;
        }
      })
      .addCase(fetchTopSellingAlbums.fulfilled, (state, action) => {
        state.topSelling = action.payload;
      })
      .addCase(searchAlbumCatalog.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchTopSellingAlbums.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
      })
      .addCase(addNewAlbum.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      );
  }
});

export const { clearCurrentAlbum, clearSearchResults } = albumSlice.actions;
export default albumSlice.reducer;