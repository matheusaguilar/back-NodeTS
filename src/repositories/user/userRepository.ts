import { Repository } from '../repository';
import { IUserRepository } from './iUserRepository';

const SELECT_ALL_QUERY = 'SELECT * FROM Usuario';

export class UserRepository extends Repository implements IUserRepository {

  async getAll() {
    const resp = await this.call(SELECT_ALL_QUERY).catch(err => this.handler(err));
    console.log(resp);

    return resp;
  }

}
