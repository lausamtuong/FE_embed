import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_ROOT_ENDPOINT, TEMP_FEED_ENDPOINT } from '../connection';
import { Thermo } from '../modules/thermos/domains';
import { FanStatus } from '../modules/lamps/domains/models/thermo-status';

const config = {
  headers: {
    'X-AIO-Key': process.env.REACT_APP_ADAFRUIT_X_AIO_Key,
  },
};

export const getThermos = createAsyncThunk<Thermo[], void>(
  'thermos/getThermos',
  async (_, { rejectWithValue }) => {
    const listObj: any = [];
    const response = await axios.get(
      `${BACKEND_ROOT_ENDPOINT}/fans/list`,
    );
    if (response.data) {
      const fans = response.data.fans;
      return fans;
    }
    // if (responseForThermosDescription.data) {
    //   const thermos = responseForThermosDescription.data.data;
    //   for (const element of thermos) {
    //     listObj.push(element);
    //   }
    // }

    // const response = await axios.get(`${TEMP_FEED_ENDPOINT}`, config);

    // if (response.data) {
    //   const data = response.data;
    //   if (data?.value) {
    //     if (typeof data.value === 'string') {
    //       const thermoObj: Thermo = {
    //         id: data.feed_id,
    //         data: data.value,
    //       };
    //       // console.log(data)
    //       const tempObj = listObj[0];
    //       listObj[0] = { ...tempObj, ...thermoObj };
    //       // return [thermoObj];
    //       return listObj;
    //     }
    //     return data.value;
    //   }
    // }

    if (response.status < 200 || response.status >= 300) {
      return rejectWithValue(response.data.message ?? 'error');
    }
    return [];
  },
);

export interface UpdateThermoDetailForm {
  name?: string;
  imageUrl?: string;
}

export const updateThermos = createAsyncThunk<
  UpdateThermoDetailForm,
  UpdateThermoDetailForm
>('thermos/updateThermos', async (updateThermoDto, { rejectWithValue }) => {
  const response = await axios.patch(
    `${BACKEND_ROOT_ENDPOINT}/thermos/2495577`,
    updateThermoDto,
  );

  if (response.status < 200 || response.status >= 300) {
    // toast.error(response.data.message ?? 'error')
    throw Error(response.data.message ?? 'error');
    return rejectWithValue(response.data.message ?? 'error');
  }

  return updateThermoDto;
});

type LoadingStatus = 'Idle' | 'Pending' | 'Fulfilled';
export interface ThermoControlState {
  thermos: Thermo[];
  currentTemp: string;
  loadingStatus: LoadingStatus;
}

export interface UpdateSingleFanDetailForm {
  fan_id: string;
  name?: string;
  imageUrl?: string;
  status?: FanStatus;
}
const initialState: ThermoControlState = {
  thermos: [],
  currentTemp: '...calculating',
  loadingStatus: 'Pending',
};

export const thermoControlSlice = createSlice({
  name: 'thermoControlSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getThermos.fulfilled, (state, action) => {
      console.log(action.payload, '92 get thermos fulfilled');
      state.thermos = action.payload;
      state.currentTemp = action.payload[0].data;
      state.loadingStatus = 'Fulfilled';
    });
    builder.addCase(getThermos.pending, (state) => {
      state.loadingStatus = 'Pending';
    });

    builder.addCase(updateThermos.fulfilled, (state, action) => {
      state.thermos[0].name = action.payload.name;
      state.thermos[0].imageUrl = action.payload.imageUrl;
      state.loadingStatus = 'Fulfilled';
    });
    builder.addCase(updateThermos.pending, (state) => {
      state.loadingStatus = 'Pending';
    });
  },
});

// Action creators are generated for each case reducer function
// export const {} = lampControlSlice.actions;

export default thermoControlSlice.reducer;
