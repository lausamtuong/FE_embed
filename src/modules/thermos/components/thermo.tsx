import {
  Button,
  Card,
  CardProps,
  Checkbox,
  Form,
  Input,
  Modal,
  ModalProps,
  Slider,
  Space,
  Switch,
  TimePicker,
  Typography,
} from 'antd';
import io from 'socket.io-client';

import dayjs from 'dayjs';
import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import { devices, ItemImageHolder } from '../../../common';
import { TextProps } from 'antd/es/typography/Text';
import {
  UpdateSingleFanDetailForm,
  UpdateThermoDetailForm,
} from '../../../redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { updateAdafruit } from '../../../apis/update';
import axios from 'axios';
import { BACKEND_ROOT_ENDPOINT } from '../../../connection';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const { Text } = Typography;

interface CustomizedImageContainerProps {
  imageUrl: string;
}
const CustomizedImageContainer = styled.div<CustomizedImageContainerProps>`
  background-image: ${(props) => `url(${props.imageUrl})`};
  width: 100px;
  height: 100px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 10px;
  position: relative;
  top: -10px;
`;

const marks = {
  0: 'Low',
  100: {
    style: {
      color: 'green',
    },
    label: <strong>Medium</strong>,
  },
  200: {
    style: {
      color: '#f50',
    },
    label: <strong>High</strong>,
  },
};

const ThermoDetailForm: React.FC<DataThermoComponentProps> = ({
  data,
  saveChangeSubmission,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [form] = Form.useForm();
  const imageUrl = Form.useWatch('ImageUrl', form);
  const [workingTime, setWorkingtime] = useState(data.is_set_working_time);
  const onFinish = async (values: any) => {
    console.log('Success:', values);
    const form = {
      id: 'fan1',
      name: values.name,
      intensity: values.intensity,
      is_set_working_time: values.is_set_working_time,
      imageUrl: values.image,
      working_time_end: dayjs(values.working_time_end).format('HH:mm:ss'),
      working_time_start: dayjs(values.working_time_start).format('HH:mm:ss'),
    };
    await updateAdafruit('dadn-fan-1', form.intensity);
    await axios.post(`${BACKEND_ROOT_ENDPOINT}/fans/update`, form);
    setIsEditMode(false);
    console.log('Success:', values, form);
    // saveChangeSubmission(form);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const resetFields = () => {
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      ...data,
      intensity: data.intensity,
      is_set_working_time: data.is_set_working_time,
      working_time_start: dayjs('1970-01-01T' + data?.working_time_start),
      working_time_end: dayjs('1970-01-01T' + data?.working_time_end),
    });
  }, [data]);

  return (
    <>
      <Form
        form={form}
        name="basic"
        disabled={!isEditMode}
        layout={'vertical'}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Thermo Name"
          name="name"
          initialValue={data.name}
          rules={[{ required: true, message: 'Please input thermo name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Image Url"
          name="image"
          initialValue={data.imageUrl}
          rules={[{ required: true, message: 'Please input image Url!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Fans Intensity"
          name="intensity"
          initialValue={Number(data.intensity)}
          rules={[{ required: true, message: 'Please input image Url!' }]}
        >
          <Slider marks={marks} max={200} />
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p style={{ margin: '0px' }}>Set Working Time</p>
          <Form.Item
            label=""
            style={{ margin: '0px' }}
            name="is_set_working_time"
            initialValue={data.is_set_working_time}
            valuePropName="checked"
            rules={[{ required: false, message: 'Please input image Url!' }]}
          >
            <Checkbox
              onChange={(e) => {
                setWorkingtime(e.target.checked);
              }}
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <p>Start</p>
            <Form.Item
              style={{ margin: 0 }}
              name="working_time_start"
              initialValue={dayjs('1970-01-01T' + data?.working_time_start)}
              rules={[{ required: false, message: 'Please input image Url!' }]}
            >
              <TimePicker disabled={!isEditMode || !workingTime} />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <p>End</p>
            <Form.Item
              style={{ margin: 0 }}
              name="working_time_end"
              initialValue={dayjs('1970-01-01T' + data?.working_time_end)}
              rules={[{ required: false, message: 'Please input image Url!' }]}
            >
              <TimePicker disabled={!isEditMode || !workingTime} />
            </Form.Item>
          </div>
        </div>
        <Form.Item
          label={<div>Fans Info: {data.power}</div>}
          name="Power"
          initialValue={data.imageUrl}
          rules={[{ required: false, message: 'Please input image Url!' }]}
        >
          {/* <Input /> */}
        </Form.Item>

        <CustomizedImageContainer imageUrl={imageUrl} />

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        <Button
          style={{
            width: '74px',
            position: 'absolute',
            top: '-56px',
            right: '74px',
          }}
          onClick={() => {
            resetFields();
            setIsEditMode(false);
          }}
        >
          Cancel
        </Button>
        <Button
          style={{ width: '74px', position: 'absolute', top: '-56px' }}
          onClick={() => {
            setIsEditMode(true);
          }}
        >
          Edit
        </Button>
      </div>
      {/* position:'relative',top:'-56px' */}
    </>
  );
};

const CustomizedModel: React.FC<ModalProps> = styled(Modal)`
  .ant-modal-content {
    min-height: 400px;
  }
`;
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
  column-gap: 20px;
`;

const Seperator = styled.div`
  border-top: solid #dcdce7 1px;
  margin-top: 10px;
  padding-bottom: 10px;
`;

const CustomizedText: React.FC<TextProps> = styled(Text)`
  padding-right: 8px;
`;
interface DataThermoComponentProps {
  data: ThermoComponentProps;
  saveChangeSubmission: (form: UpdateThermoDetailForm) => Promise<void>;
  toggleFanHandler?: (lampId: UpdateSingleFanDetailForm) => Promise<void>;
  handleGetFans?: any;
}
interface ThermoComponentProps {
  id: string;
  temp?: number;
  humi?: number;
  name?: string;
  status?: 'on' | 'off';
  imageUrl?: string | undefined;
  power?: string;
  intensity?: number;
  mode?: string;
  working_time_start?: string;
  working_time_end?: string;
  is_set_working_time?: boolean;
}
export const ThermoComponent: React.FC<DataThermoComponentProps> = ({
  data,
  saveChangeSubmission,
  toggleFanHandler,
  handleGetFans,
}) => {
  const socket = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(Boolean(data.intensity));
  const [open, setOpen] = useState(false);
  const statusChangeHandler = async (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const toggledStatus = !status;
    const form: UpdateSingleFanDetailForm = {
      fan_id: data.id,
      status: toggledStatus ? 'on' : 'off',
    };
    // if (toggleFanHandler) toggleFanHandler(form);
    await updateAdafruit('dadn-fan-1', !status ? 100 : 0);
    setStatus(!status);
  };
  const showModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    setStatus(Boolean(data.intensity));
  }, [data]);

  const handleOk = () => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   setOpen(false);
    // }, 3000);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    (async () => {
      const client = io(`http://localhost:8080`, {
        extraHeaders: { lampID: `lamp1` },
        // transports: [ 'websocket' ],
        path: '/socket.io/socket.io.js',
      });
      client.on('connect', async () => {
        client.on(`hienhien612/feeds/dadn-fan-1`, (datax) => {
          handleGetFans && handleGetFans();
        });
      });
      socket.current = client;
    })();
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const defaultImageUrl =
    'https://assets.fishersci.com/TFS-Assets/CCG/product-images/default.jpg-650.jpg';
  return (
    <>
      <CustomizedModel
        width={500}
        open={open}
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p>Temperature Reporter</p>
          </div>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <ThermoDetailForm
          data={data}
          saveChangeSubmission={saveChangeSubmission}
        />
      </CustomizedModel>

      <CustomizedSquareCard hoverable={true} onClick={showModal}>
        <FlexRowWrapper>
          <ItemImageHolder imageUrl={data?.imageUrl ?? defaultImageUrl} />
          <Text strong>{data.name ? data.name : 'Thermo Name'}</Text>
        </FlexRowWrapper>
        <Seperator />
        <Space>
          <CustomizedText>Fans :</CustomizedText>
          <span
            onClick={(e) => {
              statusChangeHandler(e);
            }}
          >
            <Switch
              checkedChildren="On"
              unCheckedChildren="Off"
              checked={status}
            />
          </span>
        </Space>
      </CustomizedSquareCard>
    </>
  );
};
