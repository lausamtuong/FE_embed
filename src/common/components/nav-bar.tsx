import styled from 'styled-components';

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { devices, logoUrl } from '../constants';
import {
  Typography,
  MenuProps,
  Menu,
  Button,
  Tooltip,
  Switch,
  message,
} from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { LogoutOutlined, MessageOutlined } from '@ant-design/icons';
import { LogHistoryContainer } from '../containers/log-history-container';
import axios from 'axios';
import { BACKEND_ROOT_ENDPOINT } from '../../connection';
import io from 'socket.io-client';
import { updateAdafruit } from '../../apis/update';
const NavBarHolder = styled.div`
  padding: 10px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid;
  border-width: 1px;
  border-color: rgba(5, 5, 5, 0.06);
  background-color: #f5f5f5;
`;
interface LogoContainerProps {
  logoUrl: string;
}
const LogoContainer = styled.div<LogoContainerProps>`
  background-image: ${(props) => `url(${props.logoUrl})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 44px;
  height: 44px;
  margin-right: 10px;
`;
const GroupElement = styled.div`
  display: flex;
  .ant-menu-horizontal {
    border-bottom: none !important;
  }
`;
const UserDisplay = styled.div`
  display: flex;
  padding-right: 20px;
  align-items: center;
`;
const CustomizedMenu: React.FC<MenuProps> = styled(Menu)`
  background-color: #f5f5f5;
`;

const WidthWrapper = styled.div`
  width: 100px;

  @media ${devices.tablet} {
    min-width: 300px;
  }
`;

const CustomizedText: React.FC<TextProps> = styled(Typography.Text)`
  padding-left: 10px;
  display: none;
  .span {
    display: block;
  }
  @media ${devices.tablet} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

export interface Topic {
  content: string;
  icon: JSX.Element;
  path: string;
}
interface NavBarPropsType {
  topics: Topic[];
}
interface IUser {
  username: string;
  auto_mode: number;
  outdoor_mode: number;
}

export const NavBar: React.FC<NavBarPropsType> = (props: NavBarPropsType) => {
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useRef<any>();
  const [messageApi, contextHolder] = message.useMessage();
  const warning = (data: any) => {
    messageApi.open({
      type: 'warning',
      content: `Gas is leaking!!! ${data}mg/l`,
      duration: 2,
    });
  };
  const warningHuman = () => {
    messageApi.open({
      type: 'warning',
      content: `Someone in your home!!! Please checking`,
      duration: 2,
    });
  };
  const [current, setCurrent] = useState<string>(
    location.pathname.split('/')[1]
  );
  const [user, setUser] = useState<IUser>(
    JSON.parse(localStorage.getItem('username') as string) ?? {}
  );

  const logoutHandler = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const items: MenuProps['items'] = props.topics.map((topic) => ({
    label: <Link to={`/${topic.path}`}>{topic.content}</Link>,
    key: topic.path,
    icon: topic.icon,
  }));

  const handleChangeMode = async (e: any) => {
    const newUser = { ...user, auto_mode: e ? 1 : 0 };
    setUser(newUser);
    await updateAdafruit('dadn-auto', e ? 1 : 0);
    // await axios.post(BACKEND_ROOT_ENDPOINT + '/auth/changeMode', newUser);
    localStorage.setItem('username', JSON.stringify(newUser));
  };
  const handleChangeOutdoorMode = async (e: any) => {
    const newUser = { ...user, outdoor_mode: e ? 1 : 0 };
    setUser(newUser);
    // await updateAdafruit('dadn-auto', e ? 1 : 0);
    await axios.post(BACKEND_ROOT_ENDPOINT + '/auth/changeMode', newUser);
    localStorage.setItem('username', JSON.stringify(newUser));
  };

  console.log(user);
  useEffect(() => {
    (async () => {
      const client = io(`http://localhost:8080`, {
        extraHeaders: { lampID: `lamp1` },
        // transports: [ 'websocket' ],
        path: '/socket.io/socket.io.js',
      });
      client.on('connect', async () => {
        client.on(`hienhien612/feeds/dadn-auto`, (data) => {
          setUser((user) => {
            return { ...user, auto_mode: Number(data) };
          });
        });
        client.on(`turn_gas_on`, (data) => {
          warning(data);
        });
        client.on(`someone_in_home`, (data) => {
          warningHuman();
        });
      });
      socket.current = client;
    })();
    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <>
      {contextHolder}
      <NavBarHolder>
        <GroupElement>
          <LogoContainer logoUrl={logoUrl} />
          <WidthWrapper>
            <CustomizedMenu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
              defaultSelectedKeys={[current]}
            />
          </WidthWrapper>
        </GroupElement>
        <GroupElement>
          <div style={{ display: 'flex', gap: '16px' }} className="flex gap-4">
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ paddingRight: '10px' }}>
                <CustomizedText>Auto Mode:</CustomizedText>
              </div>
              <Switch
                // defaultValue={user.auto_mode === 1 ? true : false}
                value={user.auto_mode === 1 ? true : false}
                onChange={(e) => handleChangeMode(e)}
              />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ paddingRight: '10px' }}>
                <CustomizedText>Outdoor Mode:</CustomizedText>
              </div>
              <Switch
                // defaultValue={user.auto_mode === 1 ? true : false}
                value={user.outdoor_mode === 1 ? true : false}
                onChange={(e) => handleChangeOutdoorMode(e)}
              />
            </div>
          </div>
        </GroupElement>
        <GroupElement>
          <UserDisplay>
            <LogHistoryContainer />
            <div style={{ paddingRight: '10px' }}>
              <CustomizedText>
                Welcome to Smart Home, {`${user.username}`}
              </CustomizedText>
            </div>
            <Tooltip placement="bottomRight" title={'Logout'}>
              <Button type="primary" onClick={logoutHandler}>
                <LogoutOutlined />
              </Button>
            </Tooltip>
          </UserDisplay>
        </GroupElement>
      </NavBarHolder>
    </>
  );
};
