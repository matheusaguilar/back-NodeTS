import * as graphqlTypes from 'graphql';
import { GRAPHQL_MODEL, GRAPHQL_QUERY, GRAPHQL_MUTATION } from '@graphql/Resolver';
import { getGraphQLModel } from '@models/Meta';
import { ResolverCity } from '@graphql/city/ResolverCity';

const resolvers = [
  ResolverCity
];

export class Schema {

  private resolverInstances = [];

  constructor() {
    // create resolver instances
    for (const resolver of resolvers) {
      this.resolverInstances.push(new resolver());
    }
  }

  /**
   * build and return the GraphQLSchema
   */
  buildSchema(): Promise<graphqlTypes.GraphQLSchema> {
    return new Promise((resolve) => {
      const queryFields = {};
      const mutationFields = {};
      const queryPromises = [];
      const mutationPromises = [];

      // create graphQL object for every resolver with query and mutation types
      for (const resolver of this.resolverInstances) {
        if (Reflect.hasMetadata(GRAPHQL_MODEL, resolver)) {
          const model = Reflect.getMetadata(GRAPHQL_MODEL, resolver);
          const modelType = getGraphQLModel(new model());

          queryPromises.push(this.createQueries(resolver, modelType));
        }
      }

      // fetch all query promises
      Promise.all(queryPromises).then((queries) => {
        for (const query of queries) {
          Object.assign(queryFields, query);
        }

        const query = new graphqlTypes.GraphQLObjectType({
          name: 'Query',
          fields: queryFields
        });

        resolve(new graphqlTypes.GraphQLSchema({
          query
        }));

      });
    });
  }

  /**
   * create queries for every resolver.
   * @param resolver the resolver.
   * @param modelType the modelType of resolver.
   */
  private async createQueries(resolver, modelType) {
    const queryFields = {};

    for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(resolver))) {
      if (Reflect.hasMetadata(GRAPHQL_QUERY, resolver, method)) {
        const queryName = Reflect.getMetadata(GRAPHQL_QUERY, resolver, method)
        const hasArgs = resolver[method].length > 0;
        const argNames = this.getFunctionArgsNames(resolver[method]);
        queryFields[queryName] = {};
        queryFields[queryName].type = new graphqlTypes.GraphQLList(modelType);

        queryFields[queryName].resolve = (_, args) => { // resolve
          if (hasArgs) {
            const argsAsArray = [];
            for (const arg of Object.keys(args)) {
              argsAsArray.push(args[arg]);
            }
            return resolver[method].apply(resolver, argsAsArray);
          }
          return resolver[method]();
        };

        if (hasArgs) { // add args params
          queryFields[queryName].args = {};
          for (const arg of argNames) {
            queryFields[queryName].args[arg] = {
              type: graphqlTypes.GraphQLString
            }
          }
        }
      }
    }

    return queryFields;
  }

  /**
   * return function parameters names.
   * @param func the function to look.
   */
  private getFunctionArgsNames(func) {
    return `${func}`
      .replace(/[/][/].*$/mg, '') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(',').filter(Boolean); // split & filter [""]
  }

}
