import * as graphqlTypes from 'graphql';

export const ENTITY = 'entity';
export const PK = 'pk';
export const COLUMN = 'property';
const GRAPHQL_TYPE = 'graphql_type';
const GRAPHQL_RESOLVE = 'graphql_resolve';

/************************************************* ANNOTATIONS */

/**
 * Decorator to set metadata for model.
 * @param name
 */
export function entity(name?: string) {
  return (target: any) => {
    Reflect.defineMetadata(ENTITY, name ? name : target.name, target.prototype);
  }
}

/**
 * Decorator to set metadata for pk.
 * @param target
 * @param key
 */
export function pk(name?: string) {
  return (target : any, key : string) : any => {
    Reflect.defineMetadata(PK, true, target, key);
    Reflect.defineMetadata(COLUMN, name ? name : key, target, key);
    Reflect.defineMetadata(GRAPHQL_TYPE, getGraphQLType(target, key), target, key);
  }
}

/**
 * Decorator to set metadata for property.
 * @param target
 * @param key
 */
export function column(name?: string) {
  return (target : any, key : string) : any => {
    Reflect.defineMetadata(COLUMN, name ? name : key, target, key);
    Reflect.defineMetadata(GRAPHQL_TYPE, getGraphQLType(target, key), target, key);
  }
}

/**
 * Decorator to set metadata for property.
 * @param target
 * @param key
 */
export function fk(classType: any, name?: string) {
  return (target : any, key : string) : any => {
    const idName = name ? name : key;
    const type = new classType();
    const typeList = new graphqlTypes.GraphQLList(getGraphQLModel(type));
    const resolver = async (arg) => {
      for (const property of Object.keys(type)) {
        if (Reflect.hasMetadata(PK, type, property)) {
          type[property] = arg[idName];
          const resp = await type.read();
          return resp ? type : null;
        }
      }
    };
    Reflect.defineMetadata(COLUMN, idName, target, key);
    Reflect.defineMetadata(GRAPHQL_TYPE, typeList, target, key);
    Reflect.defineMetadata(GRAPHQL_RESOLVE, resolver, target, key);
  }
}

/************************************************* GRAPHQL */

export function getGraphQLType(target, arg) {
  const type = Reflect.getMetadata('design:type', target, arg);
  const argType = type ? type.name : 'string';
  return graphQLgetType(argType);
}

/**
 * get graphQL object type.
 * @param type
 */
function graphQLgetType(type) {
  switch (type.toLowerCase()){
    case 'string':
      return graphqlTypes.GraphQLString;
    case 'number':
      return graphqlTypes.GraphQLInt;
    case 'boolean':
      return graphqlTypes.GraphQLBoolean;
    default:
      return new graphqlTypes.GraphQLList(type);
  }
}

/**
 * get GraphQL model for an object instance entity.
 * @param instance
 */
export function getGraphQLModel(instance): any {
  const type = {
    name: null,
    fields: {}
  }

  if (Reflect.hasMetadata(ENTITY, instance)) {
    type.name = Reflect.getMetadata(ENTITY, instance); // get class metadata

    for (const key of Object.keys(instance)) { // get properties metadata
      if (Reflect.hasMetadata(GRAPHQL_TYPE, instance, key)) {
        if (Reflect.getMetadata(GRAPHQL_TYPE, instance, key) instanceof graphqlTypes.GraphQLList) {
          const fkType = Reflect.getMetadata(GRAPHQL_TYPE, instance, key);
          type.fields[fkType.ofType.name.toLowerCase()] = {
            type: fkType.ofType,
            resolve: Reflect.getMetadata(GRAPHQL_RESOLVE, instance, key)
          };
        } else {
          type.fields[Reflect.getMetadata(COLUMN, instance, key)] = {};
          type.fields[Reflect.getMetadata(COLUMN, instance, key)].type
          = Reflect.getMetadata(GRAPHQL_TYPE, instance, key);
        }
      }
    }
  }

  return new graphqlTypes.GraphQLObjectType(type);
}
