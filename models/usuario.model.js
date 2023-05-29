const { executeQuery, executeQueryOne } = require("../helpers/utils")

const getAll = () => {

    return executeQuery('select * from usuarios');
};

// creamos la función getById con el parámetro id para recuperar el usuario según su id
const getById = (idUsuario) => {

    return executeQueryOne('select * from usuarios where id = ?', [idUsuario])
};

const updatePassword = ({ id_usuario, newPassword }) => {

    return executeQuery('UPDATE usuarios SET password = ? WHERE id = ?', [newPassword, id_usuario])
};

const getByUsername = (username) => {

    return executeQueryOne('select * from usuarios where username = ?', [username])
};






module.exports = {
    getAll,
    getById,
    updatePassword,
    getByUsername
}