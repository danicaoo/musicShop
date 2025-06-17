import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as musicianService from '../services/musicianService';

export const fetchMusicians = createAsyncThunk(
  'musicians/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await musicianService.getAllMusicians();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchMusicianDetails = createAsyncThunk(
  'musicians/fetchDetails',
  async (id, { rejectWithValue }) => {
    try {
      return await musicianService.getMusicianById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addNewMusician = createAsyncThunk(
  'musicians/addNew',
  async (musicianData, { rejectWithValue }) => {
    try {
      return await musicianService.createMusician(musicianData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const modifyMusician = createAsyncThunk(
  'musicians/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await musicianService.updateMusician(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const searchMusicianCatalog = createAsyncThunk(
  'musicians/search',
  async (query, { rejectWithValue }) => {
    try {
      return await musicianService.searchMusicians(query);
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const musicianSlice = createSlice({
  name: 'musicians',
  initialState: {
    list: [],
    currentMusician: null,
    searchResults: [],
    status: 'idle',
    error: null
  },
  reducers: {
    clearCurrentMusician: (state) => {
      state.currentMusician = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработчики для fetchMusicians
      .addCase(fetchMusicians.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMusicians.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchMusicians.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Обработчики для fetchMusicianDetails
      .addCase(fetchMusicianDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMusicianDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentMusician = action.payload;
      })
      .addCase(fetchMusicianDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Обработчики для addNewMusician
      .addCase(addNewMusician.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addNewMusician.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(addNewMusician.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Обработчики для modifyMusician
      .addCase(modifyMusician.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(modifyMusician.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.list.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentMusician?.id === action.payload.id) {
          state.currentMusician = action.payload;
        }
      })
      .addCase(modifyMusician.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Обработчик для searchMusicianCatalog
      .addCase(searchMusicianCatalog.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      });
  }
});

export const { clearCurrentMusician, clearSearchResults } = musicianSlice.actions;
export default musicianSlice.reducer;