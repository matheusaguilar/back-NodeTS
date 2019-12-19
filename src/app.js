const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const socketService = require('./services/socketService');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const renderEngine = require(path.resolve(__dirname, '../build/script/renderEngine'));
const cors = require('cors');
const exceptionUtil = require('./utils/exceptionUtil');
const graphqlHTTP = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const clienteRoute = require('./routes/cliente_routes');

/**
*
* Express, Socket and Http
*
*/
const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

const PORT = 8080;
httpServer.listen(PORT, function(){
  console.log(`Server listening on port ${PORT}!`);
});

/**
 * 
 * Socket.io Service
 * 
 */
socketService.getConnection(io);

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
* RenderEngine
*
*/
app.engine('html', renderEngine);
app.set('views', path.resolve(__dirname, '../dist'));
app.set('view engine', 'html');

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
app.use(express.static(path.resolve(__dirname, '../dist/seo'))); //SEO Files
// app.use(express.static(path.resolve(__dirname, '../'))); //Host Files Enable SSL

/**
*
* Routes
*
*/
app.use('/', clienteRoute);

/**
* 
* GraphQL
* 
*/
const auth = require('./services/authService');

app.use('/graphql', auth.authorizeDev, graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true
}));

/*
*
* Dev Teste Login
*
*/
app.get('/login_dev', auth.authorizeDev, function (req, res) {
  res.render('cliente_index');
});

app.post('/login_dev', async function(req, res){
  try{
    if (!!req.body.usuario && !!req.body.senha && 
      (req.body.usuario.toUpperCase() == 'teste'.toUpperCase() && req.body.senha.toUpperCase() == 'teste1'.toUpperCase())){
      var token = auth.generateToken({usuario: 'teste'});
      res.cookie('tokenDev', token);
      res.render('cliente_index');
    } else{
      throw "loginFail";
    }

  } catch(e){
    res.render('login_dev_index');
  }
});

/**
 * Handle uncaughtException and end application.
 */
process.on('uncaughtException', (err, origin) => {
  exceptionUtil.handle('UncaughtException', err);
  process.exit(1);
});