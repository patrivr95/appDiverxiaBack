const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const Actividad = require('../models/usuario.model');

// creamos la función checkToken para comprobar que el token que nos manda el usuario es correcto, que no esté caducado, y poder mandar la información de dicho usuario
const checkToken = async(req, res, next) => {

    const token = req.headers['authorization'];
    if(!token){
        return res.json(401).json({ error: 'Necesitas la cabecera de autenticación' })
    }

    let obj;
    try {
        obj = jwt.verify(token, 'token correcto');
    } catch (error) {
        res.status(401).json({ error: 'El token es erróneo'});
    }

    if(dayjs().unix() > obj.exp_date){
        return res.json({ error: 'El token está caducado'})
    };

    req.usuario = await Actividad.getById(obj.user_id);

    next();

}


// creamos la función checkAdmin para comprobar que el usuario que quiere acceder es administrador
const checkAdmin = async (req, res, next) => {

    const rol = req.usuario.rol
    if(rol !== 'admin'){
        return res.status(401).json({ error: 'No eres administrador'})
    }

    next();

}

module.exports = {
    checkAdmin,
    checkToken
}