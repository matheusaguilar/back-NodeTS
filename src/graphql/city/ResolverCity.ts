import { Resolver, model, query, mutation } from '../resolver';
import { RepositoryEnum } from '@repositories/repositoryEnum';
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

}
