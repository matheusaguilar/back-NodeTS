import { ENTITY, PK, COLUMN, column } from '@models/Meta';
import { Repository } from '@repositories/Repository';
import { DateUtil } from '@utils/DateUtil';

export class ORM extends Repository {

  static mapper = {};

  /**
   * check if mapper exists for the entity.
   */
  private mapperExists() {
    const notExist = !ORM.mapper[this.constructor.name];
    if (notExist) {
      ORM.mapper[this.constructor.name] = {};
    }
    return notExist;
  }

  /**
   * return id property of object.
   */
  private getIdProperty() {
    for (const val of Object.keys(this)) {
      if (Reflect.hasMetadata(PK, this, val)) {
        return val;
      }
    }
    return null;
  }

  /**
   * create immutable create query.
   */
  private createQuery() {
    let query = null;

    if (Reflect.hasMetadata(ENTITY, this)) {
      query = `INSERT INTO ${Reflect.getMetadata(ENTITY, this)} (`;

      const columns = Object.keys(this);
      const values = [];
      columns.forEach((value, index) => {
        if (Reflect.hasMetadata(COLUMN, this, value)) {
          if (!Reflect.hasMetadata(PK, this, value)) {
            const columnName = Reflect.getMetadata(COLUMN, this, value);
            values.push('?');
            query += columnName;
            if (index < columns.length - 1) {
              query += ', ';
            }
          }
        }
      });

      query += `) VALUES (${values.join()});`;
    }

    return query;
  }

  /**
   * create immutable read query.
   */
  private readQuery() {
    let query = `SELECT * FROM ${Reflect.getMetadata(ENTITY, this)} WHERE `;

    const idProperty = this.getIdProperty();
    if (idProperty) {
      query += `${idProperty} = ?`;
    }

    return query;
  }

  /**
   * create immutable delete query.
   */
  private deleteQuery() {
    let query = `DELETE FROM ${Reflect.getMetadata(ENTITY, this)} WHERE `;

    const idProperty = this.getIdProperty();
    if (idProperty) {
      query += `${idProperty} = ?`;
    }

    return query;
  }

  /**
   * create and save the object in database.
   */
  async create(): Promise<boolean> {
    if (this.mapperExists() || !ORM.mapper[this.constructor.name].create) {
      ORM.mapper[this.constructor.name].create = this.createQuery();
    }

    const values = [];
    let idProperty = null;
    Object.keys(this).forEach((val) => {
      if (!Reflect.hasMetadata(PK, this, val)) {
        values.push(this[val]);
      } else {
        idProperty = val;
      }
    });

    const resp = await this.call(ORM.mapper[this.constructor.name].create, values)
      .catch(err => this.handler(err));

    // add id to the object
    if (resp && resp.insertId && idProperty) {
      this[idProperty] = resp.insertId;
      return true;
    }

    return false;
  }

  /**
   * read an object in database based on id.
   */
  async read(): Promise<boolean> {
    if (this.mapperExists() || !ORM.mapper[this.constructor.name].read) {
      ORM.mapper[this.constructor.name].read = this.readQuery();
    }

    const idProperty = this.getIdProperty();

    if (idProperty) {
      const resp = await this.call(ORM.mapper[this.constructor.name].read, this[idProperty])
      .catch(err => this.handler(err));

      if (resp && resp.length === 1) {
        Object.keys(this).forEach((value) => {
          if (Reflect.hasMetadata(COLUMN, this, value)) {
            const val = resp[0][Reflect.getMetadata(COLUMN, this, value)] instanceof Date ?
              DateUtil.dateToString(resp[0][Reflect.getMetadata(COLUMN, this, value)])
              : resp[0][Reflect.getMetadata(COLUMN, this, value)];
            this[value] = val;
          }
        });
        return true;
      }
    }

    return false;
  }

  /**
   * create update query and update an object in database based on id.
   */
  async update(fields: {}): Promise<boolean> {
    let query = `UPDATE ${Reflect.getMetadata(ENTITY, this)} SET `;

    const idProperty = this.getIdProperty();

    if (idProperty) {
      const columns = Object.keys(fields);
      const values = [];
      columns.forEach((field, index) => {
        if (field !== idProperty && Reflect.hasMetadata(COLUMN, this, field)) {
          const colName = Reflect.getMetadata(COLUMN, this, field);
          query += `${colName} = ?`;
          values.push(fields[field]);
          if (index < columns.length - 1) {
            query += ', ';
          }
        }
      });

      query += ` WHERE ${idProperty} = ?`;
      values.push(this[idProperty]);

      const resp = await this.call(query, values)
        .catch(err => this.handler(err));

      if (resp && resp.affectedRows > 0) {
        columns.forEach((field) => {
          if (field !== idProperty && Reflect.hasMetadata(COLUMN, this, field)) {
            this[field] = fields[field];
          }
        });
        return true;
      }
    }

    return false;
  }

  /**
   * delete an object in database based on id.
   */
  async delete(): Promise<boolean> {
    if (this.mapperExists() || !ORM.mapper[this.constructor.name].delete) {
      ORM.mapper[this.constructor.name].delete = this.deleteQuery();
    }

    const idProperty = this.getIdProperty();
    if (idProperty) {
      const resp = await this.call(ORM.mapper[this.constructor.name].delete, this[idProperty])
        .catch(err => this.handler(err));

      if (resp && resp.affectedRows > 0) {
        return true;
      }
    }

    return false;
  }

}
