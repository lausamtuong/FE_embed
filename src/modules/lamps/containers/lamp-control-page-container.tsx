import styled from 'styled-components';
import { LampComponent } from '../components';
import React, { useEffect, useRef, useState } from 'react';
import { AddItemComponent, devices } from '../../../common';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import {
  getLamps,
  RootState,
  updateSingleLamp,
  UpdateSingleLampDetailForm,
  useAppDispatch,
} from '../../../redux';
import { toast, ToastContainer } from 'react-toastify';
import { Lamp } from '../domains';

const LampComponentsFlex = styled.div`
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

export const LampControlPageContainer: React.FC = () => {
  // TODO: dispatch action, get data from store
  const lampList = useSelector((state: RootState) => state.lampControl.lamps);
  const socket = useRef<any>();
  const loadingStatus = useSelector(
    (state: RootState) => state.lampControl.loadingStatus
  );
  const dispatch = useAppDispatch();

  const handleGetLamps = () => {
    return dispatch(getLamps());
  };
  useEffect(() => {
    dispatch(getLamps());
  }, []);

  const saveChangeSubmission = async (form: UpdateSingleLampDetailForm) => {
    try {
      dispatch(updateSingleLamp(form));
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  const toggleLampHandler = async (form: UpdateSingleLampDetailForm) => {
    try {
      // TODO: dispatch status change action
      dispatch(updateSingleLamp(form));
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  useEffect(() => {
    (async () => {
      const client = io(`http://localhost:8080`, {
        extraHeaders: { lampID: `lamp1` },
        // transports: [ 'websocket' ],
        path: '/socket.io/socket.io.js',
      });
      client.on('connect', async () => {
        client.on(`smarthome2023/feeds/dadn-led-1`, (data) => {
          dispatch(getLamps());
          // dispatch(updateSingleLamp({id:'lamp1', status:data}))
        });
        // client.on(`smarthome2023/feeds/lightsensor`, (data) => {
        //   console.log('sensor')
        //   dispatch(getLamps());
        //   // dispatch(updateSingleLamp({id:'lamp1', status:data}))
        // });
      });
      socket.current = client;
    })();
    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
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
      <LampComponentsFlex>
        {lampList.map((lamp, id) => (
          <LampComponent
            key={id}
            toggleLampHandler={toggleLampHandler}
            saveChangeSubmission={saveChangeSubmission}
            data={lamp}
            handleGetLamps={handleGetLamps}
          />
        ))}
        <AddItemComponent itemType="lamp" />
      </LampComponentsFlex>
    </>
  );
};
