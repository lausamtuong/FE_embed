import { Lamp } from '../models';

export interface LampRepositoryInterface {
  getLamps: () => Promise<Lamp[]>;
}
