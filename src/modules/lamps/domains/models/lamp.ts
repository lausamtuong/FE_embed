import { LampStatus } from './lamp-status';

export interface Lamp {
  id: string;
  status: LampStatus;
  name?: string;
  note?: string;
  imageUrl?: string;
  power?:string,
  intensity?: number,
  mode?: number,
  working_time_start?: string,
  working_time_end?: string,
  is_set_working_time?: boolean,
 
}
