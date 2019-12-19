const graphql = require('graphql');
const Usuario = require('./models/usuario');
const Categoria = require('./models/categoria');
const Estado = require('./models/estado');
const Cidade = require('./models/cidade');
const Endereco = require('./models/endereco');
const Servico = require('./models/servico');
const ServicoGaleria = require('./models/servicoGaleria');
const ServicoComentario = require('./models/servicoComentario');
const Contatenos = require('./models/contatenos');
const Conversa = require('./models/conversa');
const ConversaNotificacao = require('./models/conversaNotificacao');
const Mensagem = require('./models/mensagem');

const {
    GraphQLObjectType
} = graphql;

/**
 * Define Models
 */
const graphModels = [
    Usuario,
    Categoria,
    Estado,
    Cidade,
    Endereco,
    Servico,
    ServicoGaleria,
    ServicoComentario,
    Contatenos,
    Conversa,
    ConversaNotificacao,
    Mensagem
]

/**
 * Define patterns 
 */
const queryPattern = [
    'get'
]

const mutationPattern = [
    'insert',
    'update',
    'delete'
]

/**
 * read all the fields starteds with "pattern" from models.
 * @param {*} model the model to read
 * @param {*} pattern the pattern to look for in begging of function names
 */
function readFromModels(model, pattern){
    var obj = {};
    for(var prop in model){
        if (prop.length > pattern.length){
            if (prop.substring(0, pattern.length) == pattern){
                obj[prop] = model[prop];
            }
        }
    }

    return obj;
}

/**
 * create the object fields to be the queries.
 */
function createQueryFields(){
    var queries = {};

    for(model of graphModels){
        for(pattern of queryPattern){
            Object.assign(queries, readFromModels(model, pattern));
        }
    }

    return queries;
}

/**
 * create the object fields to be the mutations.
 */
function createMutationFields(){
    var mutations = {};

    for(model of graphModels){
        for(pattern of mutationPattern){
            Object.assign(mutations, readFromModels(model, pattern));
        }
    }

    return mutations;
}

/*
* Queries
*/
var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: createQueryFields()
});

/*
* Mutations
*/
var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: createMutationFields()
});

/*
* Subscriptions aren't supported yet in express-graphql
*/

module.exports = new graphql.GraphQLSchema({
    query: queryType,
    mutation: mutationType
});