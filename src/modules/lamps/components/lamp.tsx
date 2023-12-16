import {
  Button,
  Card,
  CardProps,
  Form,
  Input,
  Modal,
  ModalProps,
  Switch,
  Typography,
  Checkbox,
  Slider,
  TimePicker,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { LampStatus } from '../domains';
import React, { useEffect, useRef, useState } from 'react';
import { devices, ItemImageHolder } from '../../../common';
import { TextProps } from 'antd/es/typography/Text';
import {
  UpdateSingleLampDetailForm,
  getLamps,
  useAppDispatch,
} from '../../../redux';
import { SwitchClickEventHandler } from 'antd/es/switch';
import io from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { optionsChartLine } from '../constant';
import { updateAdafruit } from '../../../apis/update';
import { BACKEND_ROOT_ENDPOINT } from '../../../connection';
import axios from 'axios';
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

const LampDetailForm: React.FC<
  Omit<LampComponentProps, 'toggleLampHandler'>
> = ({ data, saveChangeSubmission }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataLine, setDataLine] = useState<any>({
    labels: [
      ...data.lampRecord.map((e: any) => dayjs(e.time).format('HH:mm:ss')),
    ],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [...data.lampRecord.map((e: any) => e.value)],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });
  const [form] = Form.useForm();
  const [workingTime, setWorkingtime] = useState(data.is_set_working_time);
  const imageUrl = Form.useWatch('ImageUrl', form);
  const onFinish = async (values: any) => {
    const form: DataLampComponentProps = {
      id: 'lamp1',
      name: values.name,
      is_set_working_time: values.is_set_working_time,
      imageUrl: values.image,
      working_time_end: dayjs(values.working_time_end).format('HH:mm:ss'),
      working_time_start: dayjs(values.working_time_start).format('HH:mm:ss'),
    };
    // await updateAdafruit('dadn-fan-1', form.intensity);
    await axios.post(`${BACKEND_ROOT_ENDPOINT}/lamps/update`, form);
    setIsEditMode(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const resetFields = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        is_set_working_time: data.is_set_working_time,
        working_time_start: dayjs('1970-01-01T' + data?.working_time_start),
        working_time_end: dayjs('1970-01-01T' + data?.working_time_end),
      });
    }
  }, [data, form]);

  useEffect(() => {
    setDataLine({
      labels: [
        ...data.lampRecord.map((e: any) => dayjs(e.time).format('HH:mm:ss')),
      ],
      datasets: [
        {
          label: 'ON (1) /OFF (0)',
          data: [...data.lampRecord.map((e: any) => e.value)],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
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
          label="Lamp Name"
          name="name"
          initialValue={data.name}
          rules={[{ required: true, message: 'Please input lamp name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Lamp Image"
          name="image"
          initialValue={data.imageUrl}
          rules={[{ required: true, message: 'Please input lamp name!' }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item
          label="Lamp Intensity"
          name="intensity"
          initialValue={data.intensity}
          rules={[{ required: true, message: 'Please input image Url!' }]}
        >
           <Slider />
        </Form.Item> */}
        <div
          style={{
            background: '#f8f8f8',
            paddingLeft: '12px',
            borderRadius: '8px',
          }}
        ></div>
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
          label={<div>Lamp Info: {data.power}</div>}
          name="Power"
          initialValue={data.power}
          rules={[{ required: false, message: 'Please input image Url!' }]}
        >
          {/* <Input /> */}
        </Form.Item>
        <Line options={optionsChartLine} data={dataLine} />
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
export interface DataLampComponentProps {
  id: string;
  status?: LampStatus;
  name?: string;
  note?: string;
  power?: string;
  intensity?: number;
  mode?: string;
  working_time_start?: string;
  working_time_end?: string;
  is_set_working_time?: boolean;
  imageUrl?: string;
  lampRecord?: any;
}
export interface LampComponentProps {
  data: DataLampComponentProps;
  saveChangeSubmission: (form: DataLampComponentProps) => Promise<void>;
  toggleLampHandler: (lampId: DataLampComponentProps) => Promise<void>;
  handleGetLamps?: () => void;
}

export const LampComponent: React.FC<LampComponentProps> = ({
  data,
  toggleLampHandler,
  saveChangeSubmission,
  handleGetLamps,
}) => {
  const [status, setStatus] = useState(data.status === 'on');
  const [open, setOpen] = useState(false);
  const socket = useRef<any>();
  const dispatch = useAppDispatch();
  const statusChangeHandler = async (e: any) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const toggledStatus = !status;
    await updateAdafruit('dadn-led-1', !status ? 1 : 0);
    // toggleLampHandler(form);
    setStatus(!status);
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const handleOk = () => {};

  useEffect(() => {
    (async () => {
      const client = io(`http://localhost:8080`, {
        extraHeaders: { lampID: `lamp1` },
        // transports: [ 'websocket' ],
        path: '/socket.io/socket.io.js',
      });
      client.on('connect', async () => {
        client.on(`hienhien612/feeds/dadn-led-1`, (datax) => {
          handleGetLamps && handleGetLamps();
        });
      });
      socket.current = client;
    })();
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    setStatus(data.status === 'on');
  }, [data]);

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
            <p>Lamp Reporter</p>
          </div>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <LampDetailForm
          saveChangeSubmission={saveChangeSubmission}
          data={data}
        />
      </CustomizedModel>

      <CustomizedSquareCard hoverable={true} onClick={showModal}>
        <FlexRowWrapper>
          <ItemImageHolder imageUrl={data?.imageUrl || 'image'} />
          <Text strong>{data.name ? data.name : 'Lamp Name'}</Text>
        </FlexRowWrapper>
        <Seperator />
        <CustomizedText>Status</CustomizedText>
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
      </CustomizedSquareCard>
    </>
  );
};
