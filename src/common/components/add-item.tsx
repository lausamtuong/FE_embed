import { Card, CardProps, Typography } from 'antd';
import styled from 'styled-components';
import React from 'react';

import { AddItemIconHolder } from './add-item-icon-holder';
import { TextProps } from 'antd/es/typography/Text';
import { devices } from '../constants';
import { PropertySafetyFilled } from '@ant-design/icons';

const { Text } = Typography;

const CustomizedSquareCard: React.FC<CardProps> = styled(Card)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;

  @media ${devices.tablet} {
    width: 280px;
  }
`;

const FlexRowWrapper = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 20px;
`;

const Seperator = styled.div`
  border-top: solid #dcdce7 1px;
  margin-top: 10px;
  padding-bottom: 10px;
`;
const CustomizedText: React.FC<TextProps> = styled(Typography.Text)`
  color: #c2c2c2;
`;

export interface AddItemComponentProps {
  itemType: string;
}
export const AddItemComponent: React.FC<AddItemComponentProps> = ({
  itemType,
}) => {
  return (
    <>
      <CustomizedSquareCard hoverable={true}>
        <FlexRowWrapper>
          <AddItemIconHolder />
        </FlexRowWrapper>
        <Seperator />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CustomizedText>Add {itemType}</CustomizedText>
        </div>
      </CustomizedSquareCard>
    </>
  );
};
