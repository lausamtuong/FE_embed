import styled from 'styled-components';
import { Thermo } from '../domains';
import React, { useEffect, useRef, useState } from 'react';
import { AddItemComponent, devices } from '../../../common';
import { ThermoComponent } from '../components';
import {
  getThermos,
  RootState,
  UpdateSingleFanDetailForm,
  UpdateThermoDetailForm,
  updateThermos,
  useAppDispatch,
} from '../../../redux';
import { useSelector } from 'react-redux';
import { Card, Progress } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
import { BACKEND_ROOT_ENDPOINT } from '../../../connection';
import { Line } from 'react-chartjs-2';
import { optionsChartLine } from '../../lamps/constant';
import {
  DashboardOutlined,
  FireOutlined,
  UngroupOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const ThermoComponentsFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 10px;
  @media ${devices.tablet} {
    gap: 20px;
    flex-wrap: wrap;
    flex-direction: row;
  }
`;

interface ICurrentThermor {
  temp?: {
    value?: number;
    tempRecord: any[];
  };
  gas?: {
    value?: number;
    gasRecord: any[];
  };
  humi?: {
    value?: number;
    humiRecord: any[];
  };
}
const twoColors = { '0%': '#25dc25', '50%': '#fbff14', '100%': 'red' };

export const ThermoControlPageContainer: React.FC = () => {
  const currentTemp = useSelector(
    (state: RootState) => state.thermoControl.currentTemp
  );
  const [dataLine, setDataLine] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });
  const [dataLineHumi, setDataLineHumi] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });
  const socket = useRef<any>();
  const [currentThemor, setCurrentThermor] = useState<ICurrentThermor>({});
  const [temperature, setTemperature] = useState(currentTemp);

  // TODO: dispatch action, get data from store
  const thermoList = useSelector(
    (state: RootState) => state.thermoControl.thermos
  );
  console.log(thermoList);
  const loadingStatus = useSelector(
    (state: RootState) => state.thermoControl.loadingStatus
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getThermos());
  }, []);

  const handleGetFans = () => {
    return dispatch(getThermos());
  };

  useEffect(() => {
    setTemperature(currentTemp);
  }, [currentTemp]);

  useEffect(() => {
    (async () => {
      const client = io(`http://localhost:8080`, {
        extraHeaders: { fanID: `fan1` },
        // transports: [ 'websocket' ],
        path: '/socket.io/socket.io.js',
      });
      client.on('connect', async () => {
        client.on(`hienhien612/feeds/dadn-humi-1`, async () => {
          const res = await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/humi`, {
            id: 'humi1',
          });
          setCurrentThermor((cur) => {
            return { ...cur, humi: res.data.humi };
          });
        });
        client.on(`hienhien612/feeds/dadn-temp-1`, async () => {
          const res = await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/temp`, {
            id: 'temp1',
          });
          setCurrentThermor((cur) => {
            return { ...cur, temp: res.data.temp };
          });
        });
        client.on(`hienhien612/feeds/dadn-gas`, async () => {
          const res = await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/gas`, {
            id: 'gas1',
          });
          setCurrentThermor((cur) => {
            return { ...cur, gas: res.data.gas };
          });
        });
        client.on(`hienhien612/feeds/dadn-fan-1`, async () => {
          dispatch(getThermos());
        });
      });
      socket.current = client;
    })();
    const fetchHumi = async () => {
      const res1 = await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/humi`, {
        id: 'humi1',
      });
      const res2 = await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/gas`, {
        id: 'gas1',
      });
      const res3 = await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/temp`, {
        id: 'temp1',
      });
      setCurrentThermor(() => {
        return {
          humi: res1.data.humi,
          temp: res3.data.temp,
          gas: res2.data.gas,
        };
      });
    };
    fetchHumi();
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    setDataLine({
      labels: currentThemor?.temp?.tempRecord
        ? [
            ...currentThemor.temp.tempRecord.map((e: any) =>
              dayjs(e.time).format('HH:mm:ss')
            ),
          ]
        : [],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: currentThemor?.temp?.tempRecord
            ? [...currentThemor.temp.tempRecord.map((e: any) => e.value)]
            : [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
    setDataLineHumi({
      labels: currentThemor?.humi?.humiRecord
        ? [
            ...currentThemor.humi.humiRecord.map((e: any) =>
              dayjs(e.time).format('HH:mm:ss')
            ),
          ]
        : [],
      datasets: [
        {
          label: 'Humidity (%)',
          data: currentThemor?.humi?.humiRecord
            ? [...currentThemor.humi.humiRecord.map((e: any) => e.value)]
            : [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, [currentThemor]);

  const toggleFanHandler = async (form: UpdateSingleFanDetailForm) => {
    try {
      // TODO: dispatch status change action
      // dispatch(updateSingleFan(form));
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  const saveChangeSubmission = async (form: UpdateThermoDetailForm) => {
    try {
      dispatch(updateThermos(form));
    } catch (error) {
      toast.error('error');
    }
  };

  return (
    <>
      {/* {loadingStatus === 'Pending' ? (
        <Skeleton />
      ) : ( */}
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ThermoComponentsFlex>
          <Card style={{ width: 300 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <FireOutlined style={{ fontSize: '20px' }} />
                <p>Gas: </p>
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: 'red',
                }}
              >
                <Progress
                  type="circle"
                  percent={(Number(currentThemor?.gas?.value) / 1000) * 100}
                  strokeColor={twoColors}
                  format={(percent) => (Number(percent) * 1000) / 100 + ' mg/l'}
                />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <DashboardOutlined style={{ fontSize: '20px' }} />
                <p>Temperature: </p>
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: 'red',
                }}
              >
                {currentThemor?.temp?.value}°C
              </div>
            </div>{' '}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                <UngroupOutlined style={{ fontSize: '20px' }} />
                <p>Humidity: </p>
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '24px',
                  color: 'red',
                }}
              >
                {currentThemor?.humi?.value}°C
              </div>
            </div>
          </Card>
          {thermoList.map((thermo) => (
            <ThermoComponent
              saveChangeSubmission={saveChangeSubmission}
              key={thermo.id}
              data={thermo}
              handleGetFans={handleGetFans}
              toggleFanHandler={toggleFanHandler}
            />
          ))}
          <AddItemComponent itemType="thermo sensor" />
          <Line
            options={{
              ...optionsChartLine,
              plugins: {
                ...optionsChartLine.plugins,
                title: {
                  ...optionsChartLine.plugins.title,
                  text: 'Humidity',
                },
              },
            }}
            data={dataLineHumi}
          />
          {/* <Seperator /> */}
          <Line
            options={{
              ...optionsChartLine,
              plugins: {
                ...optionsChartLine.plugins,
                title: {
                  ...optionsChartLine.plugins.title,
                  text: 'Temperature',
                },
              },
            }}
            data={dataLine}
          />
          {/* <Line options={optionsChartLine} data={dataLine} /> */}
        </ThermoComponentsFlex>
      </>
      {/* )} */}
    </>
  );
};
