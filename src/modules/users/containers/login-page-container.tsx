import React from 'react';
import { LoginPageWrapper } from '../components';
import axios from 'axios';
import { BACKEND_ROOT_ENDPOINT } from '../../../connection';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export interface LoginSubmissionForm {
  username: string;
  password: string;
}

export const LoginPageContainer: React.FC = () => {
  const navigate = useNavigate();

  const loginSubmissionHandler = async (form: LoginSubmissionForm) => {
    try {
      const data = await axios({
        method: 'post',
        url: `${BACKEND_ROOT_ENDPOINT}/auth/login`,
        data: {
          username: form.username,
          password: form.password,
        },
      });
      localStorage.setItem('username', JSON.stringify(data.data.user));
      localStorage.setItem('id', data.data.id);
      navigate('/');
    } catch (error) {
      const response = (error as any).response;
      if (response) {
        if (response.data) {
          toast.error((error as any).response.data.message);
        }
        // console.log((error as any).response.status);
        // console.log((error as any).response.headers);
      }
    }
  };

  return (
    <>
      <LoginPageWrapper
        loginSubmissionHandler={loginSubmissionHandler}
      ></LoginPageWrapper>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};
