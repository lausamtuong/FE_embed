import {
  AppstoreOutlined,
  HomeOutlined,
  FireOutlined,
  BulbOutlined,
  LineChartOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { NavBar } from './nav-bar';
import { Button, message, Space } from 'antd';

const BackgroundColorWrapper = styled.div`
  padding-top: 20px;
  background-color: #ececf2;
  min-height: calc(100vh - 84px);
  overflow: auto;
`;

export const Layout: React.FC = () => {
  
  return (
    <>
      <NavBar
        topics={[
          { content: 'Home', icon: <HomeOutlined />, path: '' },
          { content: 'Lamp', icon: <BulbOutlined />, path: 'lamp' },
          { content: 'Thermo', icon: <CoffeeOutlined />, path: 'thermo' },
        ]}
      />

      <BackgroundColorWrapper>
        <Outlet />
      </BackgroundColorWrapper>
    </>
  );
};
