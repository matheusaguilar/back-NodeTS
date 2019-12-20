import 'module-alias/register';
import 'reflect-metadata';
import * as path from 'path';
import * as http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { ExceptionUtil } from '@utils/ExceptionUtil';

import graphqlHTTP from 'express-graphql';
import { Schema } from '@graphql/Schema';

/**
 * Handle uncaughtException and end application.
 */
process.on('uncaughtException', (err: Error) => {
  ExceptionUtil.handle('UncaughtException', err);
  process.exit(1);
});

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

/**
*
* GraphQL
*
*/
new Schema().buildSchema().then((graphqlSchema) => {
  app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  }));
});
