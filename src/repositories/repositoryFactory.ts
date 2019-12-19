import { RepositoryEnum } from './repositoryEnum';
import { UserRepository } from './user/userRepository';
import { CityRepository } from './city/CityRepository';

export class RepositoryFactory {

  static instance = null;

  private constructor() {
  }

  /**
   * get an instance of repository factory.
   */
  static getInstance(): RepositoryFactory {
    if (!this.instance) {
      this.instance = new RepositoryFactory();
    }
    return this.instance;
  }

  /**
   * get an instance of repository.
   * @param repository
   */
  getRepository(repository: RepositoryEnum): any | null {
    switch (repository){
      case RepositoryEnum.User:
        return new UserRepository();
      case RepositoryEnum.City:
        return new CityRepository();
    }

    return null;
  }

}
