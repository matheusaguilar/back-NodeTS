import { RepositoryEnum } from '@repositories/repositoryEnum';
import { RepositoryFactory } from '@repositories/repositoryFactory';
import { Model } from '@models/model';

export const GRAPHQL_MODEL = 'graphql_model';
export const GRAPHQL_QUERY = 'graphql_operation';
export const GRAPHQL_MUTATION = 'graphql_operation';

/************************************************* ANNOTATIONS */
export function model(model: Function) {
  return (target: any) => {
    Reflect.defineMetadata(GRAPHQL_MODEL, model, target.prototype);
  }
}

export function query(name?: string) {
  return (target : any, key : string) : any => {
    Reflect.defineMetadata(GRAPHQL_QUERY, name ? name : key, target, key);
  }
}

export function mutation(name?: string) {
  return (target : any, key : string) : any => {
    Reflect.defineMetadata(GRAPHQL_MUTATION, name ? name : key, target, key);
  }
}

/************************************************* Resolver */
export class Resolver <T> {

  public repository: T = null;

  constructor(repositoryType: RepositoryEnum) {
    this.repository = RepositoryFactory.getInstance().getRepository(repositoryType);
  }

}
