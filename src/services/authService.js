const jwt = require('jsonwebtoken');
const SALT_KEY = 'owp1SY0682TbEqZfgD2PIKLzVEfx0RnL';

class AuthService{
    
    /**
     * Method to generate a token of acess to the user
     * @param {*} data data to be stored in the token
     */
    generateToken(data){
        return jwt.sign(data, SALT_KEY, { expiresIn: 240 });
    }

    /**
     * Function to decode a token
     * @param {*} token token to be decoded
     * @returns decoded token
     */
    decodeToken(token){
        var data = undefined;
        try{
            data = jwt.verify(token, SALT_KEY);
        } catch(e){
            // console.log(e);
        }
        return data;
    }

    /**
     * Method to check if user has a valid token to access routes
     * @param {*} req user request
     * @param {*} res user response
     * @param {*} next call next function of route 
     */
    authorize(req, res, next){
        var token = req.cookies.token;

        if (!token) {
            res.render('cliente_index', {
                cleardata: true
            });

        } else {
            jwt.verify(token, SALT_KEY, function (error, decoded) {
                if (error) {
                    res.render('cliente_index', {
                        cleardata: true
                    });

                } else {
                    var obj = {};
                    for(var prop in decoded){
                        if (prop != 'iat' && prop != 'exp')
                            obj[prop] = decoded[prop];
                    }

                    var updatedToken = jwt.sign(obj, SALT_KEY, { expiresIn: '1d' });
                    res.cookie('token', updatedToken);

                    next();
                }
            });
        }
    }

    /**
     * Authorize for development
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    authorizeDev(req, res, next){
        var token = req.cookies.tokenDev;

        if (!token) {
            res.render('login_dev_index');

        } else {
            jwt.verify(token, SALT_KEY, function (error, decoded) {
                if (error) {
                    res.render('login_dev_index');

                } else {
                    var obj = {};
                    for(var prop in decoded){
                        if (prop != 'iat' && prop != 'exp')
                            obj[prop] = decoded[prop];
                    }

                    var updatedToken = jwt.sign(obj, SALT_KEY, { expiresIn: 240 });
                    res.cookie('tokenDev', updatedToken);

                    next();
                }
            });
        }
    }
}

module.exports = new AuthService();