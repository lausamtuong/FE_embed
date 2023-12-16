import axios from 'axios';
import { Lamp } from '../domains';
import { LampRepositoryInterface } from '../domains/repositories/lamp.repository';

export class LampApi implements LampRepositoryInterface {
  getLamps = async (): Promise<Lamp[]> => {
    return axios.get('');
  };
}
