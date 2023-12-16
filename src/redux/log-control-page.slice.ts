import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BACKEND_ROOT_ENDPOINT, LAMP_FEED_ENDPOINT } from '../connection';
import { RootState } from './store';

export interface Log {
  id: string;
  content: string;
  time: string;
}

export const getLogs = createAsyncThunk<Log[], void>(
  'logs/getLogs',
  async (name, { rejectWithValue }) => {
    const listObj: Log[] = [];
    const response = await axios.get(`${BACKEND_ROOT_ENDPOINT}/logs/list`);
    if (response.data) {
      console.log(response.data)
      const logs = response.data.logs;
      for (const element of logs) {
        const log: Log = {
          id: element.id,
          content: element.content,
          time: element.time,
        };
        listObj.push(log);
      }
      return listObj;
    }

    if (response.status < 200 || response.status >= 300) {
      return rejectWithValue(response.data.message ?? 'error');
    }
    return [];
  },
);

export interface CreatelogDto {
  content: string;
  time: string;
}
export const createLog = createAsyncThunk<
  Log,
  CreatelogDto,
  { state: RootState }
>('logs/createLog', async (createLogDto, { rejectWithValue, getState }) => {
  const response = await axios.post(
    `${BACKEND_ROOT_ENDPOINT}/logs/create`,
    createLogDto,
  );

  if (response.status < 200 || response.status >= 300) {
    throw Error(response.data.message ?? 'error');
    return rejectWithValue(response.data.message ?? 'error');
  }

  return { ...createLogDto, id: response.data.id };
});

type LoadingStatus = 'Idle' | 'Pending' | 'Fulfilled';
export interface LogControlState {
  logs: Log[];
  loadingStatus: LoadingStatus;
  newLogs: number;
}
const initialState: LogControlState = {
  logs: [],
  loadingStatus: 'Pending',
  newLogs: 0,
};

export const logControlSlice = createSlice({
  name: 'logControlSlice',
  initialState,
  reducers: {
    resetNewLogs(state) {
      state.newLogs = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLogs.fulfilled, (state, action) => {
      // console.log(action.payload, '92 get thermos fulfilled');
      state.logs = action.payload;
      state.loadingStatus = 'Fulfilled';
    });
    builder.addCase(getLogs.pending, (state) => {
      state.loadingStatus = 'Pending';
    });

    builder.addCase(createLog.fulfilled, (state, action) => {
      state.logs.push(action.payload);
      state.newLogs += 1;
      // state.loadingStatus = 'Fulfilled';
    });
    builder.addCase(createLog.pending, (state) => {
      // state.loadingStatus = 'Pending';
    });
  },
});

// Action creators are generated for each case reducer function
export const { resetNewLogs } = logControlSlice.actions;

export default logControlSlice.reducer;
