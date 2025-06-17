import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { 
  getCompositionsCount, 
  getEnsembleAlbums, 
  getTopSellingAlbums,
  createEnsemble,
  getAllEnsembles
} from '../services/ensembleService';

export const fetchCompositionsCount = createAsyncThunk(
  'ensembles/fetchCompositionsCount',
  async (ensembleId) => {
    return await getCompositionsCount(ensembleId);
  }
);

export const fetchEnsembleAlbums = createAsyncThunk(
  'ensembles/fetchEnsembleAlbums',
  async (ensembleId) => {
    return await getEnsembleAlbums(ensembleId);
  }
);

export const fetchTopSellingAlbums = createAsyncThunk(
  'ensembles/fetchTopSelling',
  async () => {
    return await getTopSellingAlbums();
  }
);

export const addNewEnsemble = createAsyncThunk(
  'ensembles/addNew',
  async (ensembleData) => {
    return await createEnsemble(ensembleData);
  }
);

export const fetchAllEnsembles = createAsyncThunk(
  'ensembles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllEnsembles();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const ensembleSlice = createSlice({
  name: 'ensembles',
  initialState: {
    list: [],
    compositionsCount: null,
    albums: [],
    topSelling: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompositionsCount.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompositionsCount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.compositionsCount = action.payload.count;
      })
      .addCase(fetchCompositionsCount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEnsembleAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEnsembleAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.albums = action.payload;
      })
      .addCase(fetchEnsembleAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTopSellingAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTopSellingAlbums.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.topSelling = action.payload;
      })
      .addCase(fetchTopSellingAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewEnsemble.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Optionally add new ensemble to state
      })
      .addCase(addNewEnsemble.pending, (state) => {
        state.status = 'loading';
        })
      .addCase(addNewEnsemble.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        })
      .addCase(fetchAllEnsembles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllEnsembles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchAllEnsembles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
      
  }
});

export default ensembleSlice.reducer;