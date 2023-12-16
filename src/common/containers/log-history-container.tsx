import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux';
import {
  createLog,
  getLogs,
  resetNewLogs,
} from '../../redux/log-control-page.slice';
import { LogHistoryComponent } from '../components';
import io from 'socket.io-client';

// import * as io from 'socket.io-client';
import { BACKEND_ROOT_ENDPOINT } from '../../connection';

// const socket = io.connect(BACKEND_ROOT_ENDPOINT);

export const LogHistoryContainer: React.FC = () => {
  // TODO: get log from store and set to the list of LogComponent
  // TODO: implement logic for dispatch function to get list of log, maybe use eventSource

  const logList = useSelector((state: RootState) => state.logControl.logs);
  const loadingStatus = useSelector(
    (state: RootState) => state.logControl.loadingStatus
  );
  const newLogs = useSelector((state: RootState) => state.logControl.newLogs);
  const socket = useRef<any>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLogs());
  }, []);

  console.log(newLogs);

  useEffect(() => {
    // socket.on('smarthome2023/feeds/lightsensor', (data) => {
    //   console.log(data.message, ' noti received');
    //   dispatch(
    //     createLog({
    //       content: `Turned Fan on because temperature is high (${data.message})`,
    //       time: new Date().toString().split('G')[0],
    //     }),
    //   );
    // });
    (async () => {
      const client = io(`http://localhost:8080`, {
        extraHeaders: { lampID: `lamp1` },
        // transports: [ 'websocket' ],
        path: '/socket.io/socket.io.js',
      });
      client.on('connect', async () => {
        client.on(`turn_gas_on`, (data) => {
          dispatch(
            createLog({
              content: `Warning!!! The gas is leaking too higher (${data})`,
              time: new Date().toString().split('G')[0],
            })
          );
        });
      });
      socket.current = client;
    })();
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const resetLogs = () => {
    dispatch(resetNewLogs());
  };

  return (
    <>
      <LogHistoryComponent
        logs={logList}
        resetLogs={resetLogs}
        newLogs={newLogs}
      />
    </>
  );
};
