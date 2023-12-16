import { Card, CardProps } from 'antd';
import styled from 'styled-components';
import React from 'react';

interface CustomizedCardProps {
  backgroundimage: string;
}
const CustomizedCard: React.FC<CardProps | CustomizedCardProps> = styled(
  Card,
)<CustomizedCardProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: ${(props) => `url(${props.backgroundimage})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 110px;
  height: 110px;
`;

interface DataHolderProps {
  imageUrl: string;
}
export const ItemImageHolder: React.FC<DataHolderProps> = (props) => {
  return (
    <>
      <CustomizedCard backgroundimage={props.imageUrl} />
    </>
  );
};
