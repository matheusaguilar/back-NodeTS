import { Repository } from '../repository';
import { ICityRepository } from './ICityRepository';

const SELECT_ALL_QUERY = 'SELECT * FROM City';

export class CityRepository extends Repository implements ICityRepository {

  async getAll() {
    return await this.call(SELECT_ALL_QUERY).catch(err => this.handler(err));
  }

}
