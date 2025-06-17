import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchRecordings = createAsyncThunk(
  'recordings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recordings');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addNewRecording = createAsyncThunk(
  'recordings/addNew',
  async (recordingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/recordings', recordingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const recordingSlice = createSlice({
  name: 'recordings',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecordings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecordings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRecordings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addNewRecording.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  }
});

export default recordingSlice.reducer;