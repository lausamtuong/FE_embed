import { Lamp } from '../domains';
import { LampRepositoryInterface } from '../domains/repositories/lamp.repository';
import { LampApi } from './lamp.api';

export class LampRepository implements LampRepositoryInterface {
  constructor(private readonly api: LampApi) {}

  getLamps = async (): Promise<Lamp[]> => {
    const values = await this.api.getLamps();
    return [];
  };
}
