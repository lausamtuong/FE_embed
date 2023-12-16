import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Lamp, LampStatus } from '../modules/lamps';
import axios from 'axios';
import { BACKEND_ROOT_ENDPOINT, LAMP_FEED_ENDPOINT } from '../connection';
import { RootState } from './store';
import { createLog } from './log-control-page.slice';
import { DataLampComponentProps } from '../modules/lamps/components';

const config = {
  headers: {
    'X-AIO-Key': process.env.REACT_APP_ADAFRUIT_X_AIO_Key,
  },
};

export const getLamps = createAsyncThunk<DataLampComponentProps[], void>(
  'lamps/getLamps',
  async (name, { rejectWithValue }) => {
    const response = await axios.get(`${BACKEND_ROOT_ENDPOINT}/lamps/list`);
    if (response.data) {
      const lamps = response.data.lamps;
      return lamps;
    }

    if (response.status < 200 || response.status >= 300) {
      return rejectWithValue(response.data.message ?? 'error');
    }
    return [];
  },
);

export interface UpdateSingleLampDetailForm {
  id: string;
  name?: string;
  imageUrl?: string;
  status?: LampStatus;
}
export const updateSingleLamp = createAsyncThunk<
DataLampComponentProps,
DataLampComponentProps,
  { state: RootState }
>(
  'lamps/updateLamp',
  async (updateLampDto, { rejectWithValue, getState, dispatch }) => {
    const response = await axios.post(
      `${BACKEND_ROOT_ENDPOINT}/lamps/update`,
      updateLampDto,
    );

    if (response.status < 200 || response.status >= 300) {
      throw Error(response.data.message ?? 'error');
      return rejectWithValue(response.data.message ?? 'error');
    }

    const state = getState();
    const stateOfLamps = state.lampControl.lamps.map((element) => {
      return element.status;
    });
    // console.log(stateOfLamps)

    const updatedLampPosition = parseInt(updateLampDto.id) - 1;
    if (
      updateLampDto.status &&
      stateOfLamps[updatedLampPosition] !== updateLampDto.status
    ) {
      const stateOfLampsInBinary = state.lampControl.lamps.map(
        (element, index) => {
          if (index === updatedLampPosition) {
            return updateLampDto.status === 'on' ? '1' : '0';
          }
          return element.status === 'on' ? '1' : '0';
        },
      );
      console.log(stateOfLampsInBinary, 'state in changing lamp');

      const adafruitToggleLampString = `${stateOfLampsInBinary[0]}:${stateOfLampsInBinary[1]}:${stateOfLampsInBinary[2]}:${stateOfLampsInBinary[3]}`;

      // console.log(adafruitToggleLampString)
      await axios.post(
        `${LAMP_FEED_ENDPOINT}`,
        {
          value: adafruitToggleLampString,
        },
        config,
      );

      await axios.post(
        `https://io.adafruit.com/api/v2/lnminhthu1505/feeds/smart-home.led${updateLampDto.id}/data`,
        {
          value: updateLampDto.status === 'on' ? '1' : '0',
        },
        config,
      );

      console.log('reatch create log 1');
      const username = localStorage.getItem('username') ?? 'You';

      dispatch(
        createLog({
          content: `${username} have turned ${updateLampDto.status} light number ${updateLampDto.id}`,
          time: new Date().toString().split('G')[0],
        }),
      );
      console.log('reatch create log');
    }

    return updateLampDto;
  },
);

type LoadingStatus = 'Idle' | 'Pending' | 'Fulfilled';
export interface LampControlState {
  lamps: DataLampComponentProps[];
  loadingStatus: LoadingStatus;
}
const initialState: LampControlState = {
  lamps: [],
  loadingStatus: 'Pending',
};

export const lampControlSlice = createSlice({
  name: 'lampControlSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLamps.fulfilled, (state, action) => {
      console.log(action.payload, '92 get thermos fulfilled');
      state.lamps = action.payload;
      state.loadingStatus = 'Fulfilled';
    });
    builder.addCase(getLamps.pending, (state) => {
      state.loadingStatus = 'Pending';
    });

    builder.addCase(updateSingleLamp.fulfilled, (state, action) => {
      const lampPosition = parseInt(action.payload.id) - 1;
      if (action.payload.name) {
        state.lamps[lampPosition].name = action.payload.name;
      }
      if (action.payload.imageUrl) {
        state.lamps[lampPosition].imageUrl = action.payload.imageUrl;
      }
      if (action.payload.status) {
        state.lamps[lampPosition].status = action.payload.status;
      }
      state.loadingStatus = 'Fulfilled';
    });
    builder.addCase(updateSingleLamp.pending, (state) => {
      // state.loadingStatus = 'Pending';
    });
  },
});

// Action creators are generated for each case reducer function
// export const {} = lampControlSlice.actions;

export default lampControlSlice.reducer;
