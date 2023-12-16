import { BulbFilled, MessageOutlined } from '@ant-design/icons';
import {
  Badge,
  BadgeProps,
  Dropdown,
  DropdownProps,
  MenuProps,
  Space,
} from 'antd';

import React from 'react';
import styled from 'styled-components';
import { Log } from '../../redux/log-control-page.slice';

const CustomizedDropdown: React.FC<DropdownProps> = styled(Dropdown)`
  &:hover {
    cursor: pointer;
  }
  .ant-dropdown-menu-vertical{
    height:400px;
    overflow:auto;
  }

`;
const CustomizedBadge: React.FC<BadgeProps> = styled(Badge)`
  sup.ant-scroll-number.ant-badge-count.ant-badge-count-sm.ant-badge-multiple-words {
    right: -10px;
  }
`;

interface LogHistoryComponentProps {
  logs: Log[];
  resetLogs: () => void;
  newLogs: number;
}
export const LogHistoryComponent: React.FC<LogHistoryComponentProps> = (
  props,
) => {
  const logList = props.logs.map((element, index) => {
    if (index >= props.logs.length - props.newLogs) {
      return {
        label: `${element.content} : ${element.time}`,
        key: element.id,
        icon: <BulbFilled />,
      };
    }
    return {
      label: `${element.content} : ${element.time}`,
      key: element.id,
    };
  });

  const items: MenuProps['items'] = [];
  for (const element of logList.reverse()) {
    items.push(element);
    items.push({ type: 'divider' });
  }

  const dropDownClickedHandler = (open: boolean) => {
    if (!open) {
      props.resetLogs();
    }
  };

  return (
    <div
      // onClick={dropDownClickedHandler}
      style={{ position: 'relative', width: '30px' }}
    >
      <CustomizedDropdown
        onOpenChange={dropDownClickedHandler}
        menu={{ items }}
        trigger={['click']}
        overlayStyle={{
          height:'400px',
          overflow: 'auto',
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <CustomizedBadge count={props.newLogs} size={'small'}>
              <MessageOutlined style={{ fontSize: '20px' }} />
            </CustomizedBadge>
            {/* <div style={{position:'absolute', right:'2px', top:'-10px'}}>
              <CustomizedText color='red'>99</CustomizedText>
            </div> */}
          </Space>
        </a>
      </CustomizedDropdown>
    </div>
  );
};
