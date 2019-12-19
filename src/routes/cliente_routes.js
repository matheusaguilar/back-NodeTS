const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const fileUploadService = require('../services/fileUploadService');
const requestUtil = require('../utils/requestUtil');
const exceptionUtil = require('../utils/exceptionUtil');
const loginValidation = require('../../test/cliente/login');
const userRepo = require('../repository/usuarioRepo');

/**
 * GET
 */

router.get('/', authService.authorizeDev, async function (req, res) {
    res.render('cliente_index');
});

router.get('/categorias', authService.authorizeDev, async function (req, res) {
    res.render('cliente_categorias_index');
});

router.get('/sobrenos', authService.authorizeDev, async function (req, res) {
    res.render('cliente_sobrenos_index');
});

router.get('/contatenos', authService.authorizeDev, async function (req, res) {
    res.render('cliente_contatenos_index');
});

router.get('/login', authService.authorizeDev, async function (req, res) {
    res.render('cliente_login_index');
});

router.get('/login#/registrar', authService.authorizeDev, async function (req, res) {
    res.render('cliente_login_index');
});

router.get('/mensagens', authService.authorizeDev, authService.authorize, async function (req, res) {
    res.render('cliente_mensagem_index');
});

router.get('/eventos', authService.authorizeDev, authService.authorize, async function (req, res) {
    res.render('cliente_evento_index');
});

// router.get('/notificacoes', authService.authorizeDev, authService.authorize, async function (req, res) {
//     res.render('cliente_notificacao_index');
// });

router.get('/sair', authService.authorizeDev, async function(req, res){
    res.clearCookie('token');
    res.render('cliente_index', {
        cleardata: true
    });
});

/**
 * POST
 */

router.post('/login', authService.authorizeDev, async function(req, res){
    try{
        //get req.body info
        const user = requestUtil.getFromBody(req.body, ['email', 'senha']);

        const resp = await userRepo.checkLogin(user.email, user.senha);
        
        if (resp instanceof Error){
            res.render('cliente_login_index', {
                alertmessage: requestUtil.sendDefaultErrorMessage()
            });

        } else if (resp.length == 0){
            res.render('cliente_login_index', {
                alertmessage: requestUtil.sendAlertMessage(requestUtil.ALERT_DANGER, 
                    'E-mail ou senha inválidos.')
            });

        } else{
            const usuario = {
                id: resp[0].id,
                email: resp[0].email,
                path_img_perfil: resp[0].path_img_perfil,
                nome: resp[0].nome,
                sobrenome: resp[0].sobrenome,
                sexo: resp[0].sexo,
                tipo_conta: resp[0].tipo_conta
            }

            const token = authService.generateToken({
                id: resp[0].id
            });

            res.cookie('token', token);

            res.render('cliente_index', {
                changeurlpage: '/',
                alertmessage: requestUtil.sendAlertMessage(requestUtil.ALERT_SUCCESS, 'Login efetuado com sucesso.'),
                usuario: usuario
            });
        }

    } catch(e){
        exceptionUtil.handle('ClienteRoute: [post]/login', e);
        res.render('cliente_login_index', {
            alertmessage: requestUtil.sendDefaultErrorMessage()
        });
    }
});

router.post('/registrar', authService.authorizeDev, fileUploadService.getUpload().none(), async function (req, res) {
    const changeUrlWhenError = '/login#/registrar';
    try{
        //get req.body info
        const user = requestUtil.getFromBody(req.body, 
            ['nome', 'sobrenome', 'data_nascimento', 'sexo', 'email', 'senha']);

        // validate
        if (loginValidation.nome(user.nome) 
            && loginValidation.nome(user.sobrenome) 
            && loginValidation.date(user.data_nascimento)
            && loginValidation.sexo(user.sexo)
            && loginValidation.email(user.email)
            && loginValidation.password(user.senha)){

            // store file
            var files = fileUploadService.retrieveFiles(req.body);
            var path_name = null;
            for(var i=0; i<files.length; i++){
                path_name = await fileUploadService.storeImage(files[i], i);
            }

            user.path_img_perfil = path_name != null? path_name
                : user.sexo == 'M'? '/assets/img/temp/avatar-male.jpg' : '/assets/img/temp/avatar-female.jpg';
            user.data_cadastro = Date.now() / 1000;
            user.tipo_conta = 'C';

            const resp = await userRepo.insert(user.email, user.senha, user.path_img_perfil, user.nome, user.sobrenome, 
                user.data_nascimento, user.data_cadastro, user.sexo, user.tipo_conta);

            if (resp instanceof Error){
                res.render('cliente_login_index', {
                    changeurlpage: changeUrlWhenError,
                    alertmessage: requestUtil.sendAlertMessage(requestUtil.ALERT_DANGER, 
                        'Não foi possível realizar o cadastro com essas informações. Se o erro persistir, entre em contato conosco.')
                });

            } else{
                //Automatic Login
                const resp = await userRepo.checkLogin(user.email, user.senha);

                const usuario = {
                    id: resp[0].id,
                    email: resp[0].email,
                    path_img_perfil: resp[0].path_img_perfil,
                    nome: resp[0].nome,
                    sobrenome: resp[0].sobrenome,
                    sexo: resp[0].sexo,
                    tipo_conta: resp[0].tipo_conta
                }
    
                const token = authService.generateToken({
                    id: resp[0].id
                });
    
                res.cookie('token', token);

                res.render('cliente_index', {
                    changeurlpage: '/',
                    alertmessage: requestUtil.sendAlertMessage(requestUtil.ALERT_SUCCESS, 'Usuário cadastrado com sucesso.'),
                    usuario: usuario
                });
            }
        
        } else{
            res.render('cliente_login_index', {
                changeurlpage: changeUrlWhenError,
                alertmessage: requestUtil.sendAlertMessage(requestUtil.ALERT_DANGER, 
                    'As informações de cadastro não consistem. Se o erro persistir, entre em contato conosco.')
            });
        }     

    } catch(e){
        exceptionUtil.handle('ClienteRoute: [post]/registrar', e);
        res.render('cliente_login_index', {
            changeurlpage: changeUrlWhenError,
            alertmessage: requestUtil.sendDefaultErrorMessage()
        });
    }
});

module.exports = router;