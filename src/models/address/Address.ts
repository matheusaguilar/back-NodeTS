import { Model } from '@models/model';
import { entity, pk, column } from '@models/meta';

export class Address extends Model {

  @pk()
  public id: number = null;

}
