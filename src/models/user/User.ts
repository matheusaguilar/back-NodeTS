import { Model } from '@models/model';
import { entity, pk, column } from '@models/meta';

@entity('Usuario')
export class User extends Model {

  @pk()
  public id: number = null;

  @column()
  public email: string = null;

  @column()
  public senha: string = null;

  @column('path_img_perfil')
  public pathImgPerfil: string = null;

  @column()
  public nome: string = null;

  @column()
  public sobrenome: string = null;

  @column('data_nascimento')
  public dataNascimento: string = null;

  @column('data_cadastro')
  public dataCadastro: string = null;

  @column()
  public sexo: string = null;

  @column('tipo_conta')
  public tipoConta: string = null;

}
