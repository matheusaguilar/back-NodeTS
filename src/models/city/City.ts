import { Model } from '@models/model';
import { entity, pk, column, fk } from '@models/meta';
import { State } from '@models/state/State';

@entity()
export class City extends Model {

  @pk()
  public id: number = null;

  @column()
  public name: string = null;

  @fk(State, 'state_id')
  public stateId: number = null;

}
