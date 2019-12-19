import { Model } from '@models/model';
import { entity, pk, column } from '@models/meta';

@entity()
export class State extends Model {

  @pk()
  public id: number = null;

  @column()
  public name: string = null;

  @column()
  public initials: string = null;

}
