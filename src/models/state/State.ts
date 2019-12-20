import { Model } from '@models/Model';
import { entity, pk, column } from '@models/Meta';

@entity()
export class State extends Model {

  @pk()
  public id: number = null;

  @column()
  public name: string = null;

  @column()
  public initials: string = null;

}
