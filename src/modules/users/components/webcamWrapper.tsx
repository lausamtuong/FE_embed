import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload, UploadProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Webcam from 'react-webcam';
import { LOGIN_BY_IMAGE_URL } from '../../../connection';

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: 'user',
};

function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(',');
  const mime = (arr[0].match(/:(.*?);/) as any)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export const WebcamWrapper = () => {
  const [picture, setPicture] = useState('');
  const webcamRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const handleUpload = () => {
    const formData = new FormData();
    const file = dataURLtoFile(picture, 'userImage.jpeg');
    formData.append('file', file);
    setUploading(true);
    // You can use any AJAX library you like
    fetch(LOGIN_BY_IMAGE_URL, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        message.success('upload successfully.');
        console.log(res);
        if (res.user !== 'Stranger') {
          localStorage.setItem('username', res.user);
          localStorage.setItem('id', res.user);

          navigate('/');
        }
        toast.error('This is a stranger');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const capture = React.useCallback(() => {
    const pictureSrc = (webcamRef.current as any).getScreenshot();
    setPicture(pictureSrc);
  }, []);

  return (
    <div>
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
      <h2 className="mb-5 text-center">
        React Photo Capture using Webcam Examle
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingBottom: '10px',
        }}
      >
        {picture == '' ? (
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <div>
        {picture != '' ? (
          <Button
            onClick={(e) => {
              e.preventDefault();
              setPicture('');
            }}
          >
            Retake
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault();
              capture();
            }}
            className="btn btn-danger"
          >
            Capture
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={picture === ''}
          loading={uploading}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </div>
    </div>
  );
};
