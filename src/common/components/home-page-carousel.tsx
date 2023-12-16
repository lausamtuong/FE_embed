import { Carousel, CarouselProps } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { devices } from '../constants';

export const CustomizedVideo = styled.video`
  width: 80%;
  @media ${devices.tablet} {
    height: 80vh;
  }
`;

export const HomePageCarousel: React.FC = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <CustomizedVideo controls autoPlay={true} loop={true}>
          <source
            src="https://cdn.dribbble.com/users/702789/screenshots/17306678/media/6e634c0d5989d4851082cdd0c83c9bd7.mp4"
            type="video/mp4"
          />
        </CustomizedVideo>
      </div>
    </>
  );
};
