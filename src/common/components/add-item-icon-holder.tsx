import styled from 'styled-components';
import React from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';

const CustomizedCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 110px;
  height: 110px;
  background-color: rgb(245, 245, 245);
`;

export const AddItemIconHolder: React.FC = () => {
  return (
    <>
      <CustomizedCard>
        <PlusCircleOutlined
          style={{
            color: '#c2c2c2',
            fontSize: 40,
            position: 'relative',
            top: '18px',
          }}
        />
      </CustomizedCard>
    </>
  );
};
