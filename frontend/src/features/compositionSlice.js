import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchCompositions = createAsyncThunk(
  'compositions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/compositions');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addNewComposition = createAsyncThunk(
  'compositions/addNew',
  async (compositionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/compositions', compositionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const compositionSlice = createSlice({
  name: 'compositions',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompositions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompositions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload; // Убедитесь, что payload содержит массив композиций
      })
      .addCase(fetchCompositions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addNewComposition.fulfilled, (state, action) => {
        // Добавляем новую композицию в начало списка
        state.list.unshift(action.payload);
        state.status = 'succeeded';
      });
  }
});

export default compositionSlice.reducer;