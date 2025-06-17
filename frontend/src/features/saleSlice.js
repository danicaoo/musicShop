import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

// Создать новую продажу
export const createSale = createAsyncThunk(
  'sales/create',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/sales', saleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Получить отчет о продажах
export const fetchSalesReport = createAsyncThunk(
  'sales/report',
  async (filters, { rejectWithValue }) => {
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.minQuantity) params.minQuantity = filters.minQuantity;
      
      const response = await api.get('/sales/report', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const saleSlice = createSlice({
  name: 'sales',
  initialState: {
    report: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSale.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Можно обновить локальное состояние, если нужно
      })
      .addCase(createSale.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSalesReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.report = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default saleSlice.reducer;