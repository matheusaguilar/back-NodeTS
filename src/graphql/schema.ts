import * as graphqlTypes from 'graphql';
import { GRAPHQL_MODEL, GRAPHQL_QUERY, GRAPHQL_MUTATION } from '@graphql/resolver';
import { getGraphQLModel } from '@models/meta';
import { ResolverCity } from '@graphql/city/ResolverCity';

const resolvers = [
  ResolverCity
];

export class Schema {

  private resolverInstances = [];
  public schema = null;

  constructor() {
    // create resolver instances
    for (const resolver of resolvers) {
      this.resolverInstances.push(new resolver());
    }

    // create graphQL object for every resolver with query and mutation types
    const queryFields = {};
    for (const instance of this.resolverInstances) {
      if (Reflect.hasMetadata(GRAPHQL_MODEL, instance)) {
        const model = Reflect.getMetadata(GRAPHQL_MODEL, instance);
        const modelType = getGraphQLModel(new model());

        for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
          // queries
          if (Reflect.hasMetadata(GRAPHQL_QUERY, instance, method)) {
            const queryName = Reflect.getMetadata(GRAPHQL_QUERY, instance, method)
            queryFields[queryName] = {};
            queryFields[queryName].type = new graphqlTypes.GraphQLList(modelType);
            queryFields[queryName].resolve = () => {
              return instance[method]();
            };
          }

          // mutations
        }
      }

      // console.log(queryFields);
      // for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
      //   console.log(method);
      // }
      // console.log(Reflect.ownKeys(instance));
      // console.log(instance);
      // for (const field in instance) {
      //   console.log(field);
      // }
    }

    const query = new graphqlTypes.GraphQLObjectType({
      name: 'Query',
      fields: queryFields
    });

    this.schema = new graphqlTypes.GraphQLSchema({
      query
    });

  //   getAllCidades: {
  //     type: new GraphQLList(type),
  //     resolve: resolverCidadeGetAll
  // }
  }

}
