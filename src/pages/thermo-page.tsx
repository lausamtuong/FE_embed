import { PagePaddingWrapper } from '../common';
import React, { useEffect } from 'react';
import { ThermoControlPageContainer } from '../modules/thermos/containers';
import { useNavigate } from 'react-router-dom';

export const ThermoPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      navigate('/login');
    }
  }, []);

  return (
    <PagePaddingWrapper>
      <ThermoControlPageContainer />
    </PagePaddingWrapper>
  );
};
