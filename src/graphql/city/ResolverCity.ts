import { Resolver, model, query, mutation } from '../Resolver';
import { RepositoryEnum } from '@repositories/RepositoryEnum';
import { ICityRepository } from '@repositories/city/ICityRepository';
import { City } from '@models/city/City';

@model(City)
export class ResolverCity extends Resolver<ICityRepository> {

  constructor() {
    super(RepositoryEnum.City);
  }

  @query('olaamigo')
  async getAll() {
    return await this.repository.getAll();
  }

  @query('testeamigo')
  async getAllParam(hm, teste) {
    console.log(hm, teste);
    return await this.repository.getAll();
  }

}
