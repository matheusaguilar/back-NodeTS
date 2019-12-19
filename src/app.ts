import 'module-alias/register';
import 'reflect-metadata';
import * as path from 'path';
import * as http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { ExceptionUtil } from '@utils/exceptionUtil';

import graphqlHTTP from 'express-graphql';

import { User } from '@models/user/User';
import { ResolverUser } from '@graphql/user/resolverUser';
import { getGraphQLModel } from '@models/meta';

import { State } from '@models/state/State';
import { City } from '@models/city/City';
import { ResolverCity } from '@graphql/city/ResolverCity';
import { Schema } from '@graphql/schema';

// const state = new State();
// state.name = 'Paraná';
// state.initials = 'PR';
// state.create().then(created => console.log(created));

// const city = new City();
// city.name = 'Londrina';
// city.stateId = 1;
// city.create().then(resp => console.log(resp));

// const c = new City();
// const t = getGraphQLModel(c);

// console.log(t);

// const tes = new ResolverCity();

const schema = new Schema();
// console.log(schema.schema);

// const x = new User();
// console.log(getGraphQLModel(x));
// x.email = 'matcatarinoteste3@yahoo.com.br';
// x.senha = 'M123456789';
// x.nome = 'Matheus';
// x.sobrenome = 'Teste';
// x.dataNascimento = new Date().toISOString().slice(0, 19).replace('T', ' ');
// x.dataCadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');
// x.sexo = 'M';
// x.tipoConta = 'C';

// x.id = 10;
// x.update({ nome: 'Matheus Alterado' , sobrenome: 'Aguilar' }).then((resp) => {
//   console.log(resp);
//   console.log(x);
// });

// x.id = 7;
// x.delete().then((resp) => {
//   console.log(resp);
// })

// x.id = 7;
// x.read().then((readed) => {
//   if (readed) {
//     console.log(x);
//     console.log(x.dataCadastro as any instanceof Date);
//   } else {
//     console.log('null');
//   }
// });

// x.create().then((created) => {
//   if (created) {

//   }
// });

// const y = new User();
// y.email = 'emailemail@email.com';
// y.create();

/**
*
* Express, Socket and Http
*
*/
const app = express();
const httpServer = new http.Server(app);

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

/**
*
* BodyParser, to get requests parsed in body
*
*/
app.use(bodyParser.json({
  limit: '5mb'
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

/**
*
* CookieParser, to get cookie of client parsed in requests
*
*/
app.use(cookieParser());

/**
 *
 * Enable CORS
 *
 */
app.use(cors());

/**
*
* Static files visible on host
*
*/
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.static(path.resolve(__dirname, '../dist/bundle')));
app.use(express.static(path.resolve(__dirname, '../dist/seo'))); // SEO Files
// app.use(express.static(path.resolve(__dirname, '../'))); //Host Files Enable SSL

/**
*
* Routes
*
*/
app.get('/', (req, res) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.use('/graphql', graphqlHTTP({
  schema: schema.schema,
  graphiql: true
}));

/**
 * Handle uncaughtException and end application.
 */
process.on('uncaughtException', (err: Error) => {
  ExceptionUtil.handle('UncaughtException', err);
  process.exit(1);
});

// const userRepo = new ResolverUser();
// userRepo.getAll().then(() => {
//   console.log('cabo');
// }).catch((error) => {
//   console.log(error);
// })
