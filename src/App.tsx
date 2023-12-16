import { ConfigProvider } from 'antd';
import React from 'react';
import { RouterComponent } from './routes';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3E6330',
        },
      }}
    >
      <RouterComponent />
    </ConfigProvider>
  );
}

export default App;
