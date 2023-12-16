import axios from 'axios';

const instance = axios.create();
instance.defaults.headers.common['X-AIO-Key'] =
  'aio_nKFK93kF3fmnQ8OnCf8mivQMBCZP';
export const updateAdafruit = (feeds: string, data: number) => {
  instance.post(
    `https://io.adafruit.com/api/v2/hienhien612/feeds/${feeds}/data`,
    {
      datum: {
        value: data,
      },
    }
  );
};
