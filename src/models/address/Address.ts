import { Model } from '@models/Model';
import { entity, pk, column } from '@models/Meta';

export class Address extends Model {

  @pk()
  public id: number = null;

}
