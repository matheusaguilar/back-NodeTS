import { Resolver, query, mutation } from '../resolver';
import { RepositoryEnum } from '@repositories/repositoryEnum';
import { IUserRepository } from '@repositories/user/iUserRepository';

export class ResolverUser extends Resolver<IUserRepository> {

  constructor() {
    super(RepositoryEnum.User);
  }

  @query()
  async getAll() {
    return this.repository.getAll();
  }
  //   async function resolverUsuarioGetAll(){
  //     return await usuarioRepo.getAll();
  // }

  // async function resolverUsuarioGetAllByDataNascimento(_, {data_nascimento}){
  //     return await usuarioRepo.getAllByDataNascimento(data_nascimento);
  // }

  // async function resolverUsuarioGetAllBySexo(_, {sexo}){
  //     return await usuarioRepo.getAllBySexo(sexo);
  // }

  // async function resolverUsuarioGetAllByTipoConta(_, {tipo_conta}){
  //     return await usuarioRepo.getAllByTipoConta(tipo_conta);
  // }

  // async function resolverUsuarioGetOneById(_, {id}){
  //     return await usuarioRepo.getOneById(id);
  // }

  // async function resolverUsuarioGetOneByEmail(_, {email}){
  //     return await usuarioRepo.getOneByEmail(email);
  // }

}
