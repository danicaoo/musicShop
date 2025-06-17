import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchInventories = createAsyncThunk(
  'inventory/fetchAll',
  async () => {
    const response = await api.get('/inventories');
    return response.data;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInventories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchInventories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default inventorySlice.reducer;