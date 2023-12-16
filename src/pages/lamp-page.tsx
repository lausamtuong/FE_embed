import { PagePaddingWrapper } from '../common';
import { LampControlPageContainer } from '../modules';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const LampPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('id');
    if (!userId) {
      navigate('/login');
    }
  }, []);

  return (
    <PagePaddingWrapper>
      <LampControlPageContainer />
    </PagePaddingWrapper>
  );
};
