import { HomePageCarousel, PagePaddingWrapper } from '../common';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      navigate('/login');
    }
  }, []);

  return (
    <PagePaddingWrapper>
      <HomePageCarousel />
    </PagePaddingWrapper>
  );
};
