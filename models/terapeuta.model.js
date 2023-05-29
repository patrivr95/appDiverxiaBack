const { executeQuery, executeQueryOne } = require("../helpers/utils")


// creamos la función getAll para mostrar a todos los trabajadores
const getAll = () => {

    return executeQuery('select * from trabajadores where estado = 0')
};


// creamos la función getById para traer a un trabajador por su id
const getById = (idTrabajador) => {

    return executeQueryOne('select * from trabajadores JOIN terapias ON trabajadores.id_terapia = terapias.id where trabajadores.id = ? and trabajadores.estado = 0', [idTrabajador]);
};

const getByIdUsuario = (idUsuario) => {

    return executeQueryOne('select trabajadores.id, trabajadores.nombre, trabajadores.apellidos, trabajadores.email, trabajadores.telefono, trabajadores.id_usuario, terapias.nombre_terapia from trabajadores JOIN terapias ON trabajadores.id_terapia = terapias.id where trabajadores.id_usuario = ? and trabajadores.estado = 0', [idUsuario]);
};


const getByEmail = (email) => {

    return executeQueryOne(`SELECT trabajadores.nombre, trabajadores.apellidos, trabajadores.email, trabajadores.telefono, trabajadores.id_usuario, usuarios.username, usuarios.rol
                            FROM trabajadores
                            JOIN usuarios
                            ON trabajadores.id_usuario = usuarios.id
                            WHERE trabajadores.email = ? and trabajadores.estado = 0`, [email])
};

const getEmailByIdDate = (idDate) => {
    return executeQueryOne(`SELECT trabajadores.email 
                            FROM trabajadores 
                            INNER JOIN citas ON trabajadores.id = citas.id_terapeuta 
                            WHERE citas.id = ? and trabajadores.estado = 0`, [idDate])
}

// creamos la función createWorker para crear un trabajador en nuestra BBDD
const createWorker = ({ nombre, apellidos, formacion, experiencia, telefono, email, id_terapia }, id_usuario) => {

    return executeQuery('insert into trabajadores (nombre, apellidos, formacion, experiencia, telefono, email, id_terapia, id_usuario) values (?, ?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, formacion, experiencia, telefono, email, id_terapia, id_usuario]);
};


// creamos la función updateById para modificar los datos de un trabajador según su id
const updateById = (idTrabajador, { nombre, apellidos, formacion, experiencia, telefono, email, id_terapia, id_usuario }) => {

    return executeQuery('update trabajadores set nombre = ?, apellidos = ?, formacion = ?, experiencia = ?, telefono = ?, email = ? id_terapia = ?, id_usuario = ?', [nombre, apellidos, formacion, experiencia, telefono, email, id_terapia, id_usuario, idTrabajador]);
};


// creamos la función deleteWorker para borrar a un trabajador según su id
const deleteWorker = (idTrabajador) => {

    return executeQuery('UPDATE trabajadores SET estado = 1 WHERE id = ?', [idTrabajador]);
};


const createUser = ({ username, password, rol }) => {

    return executeQuery('insert into usuarios (username, password, rol) values (?, ?, ?)', [username, password, rol])
};

const getTerapeutaYTerapia = () => {
    return executeQuery(`SELECT t.id, t.nombre, t.apellidos, t.formacion, t.experiencia, t.telefono, t.email, p.nombre_terapia
                            FROM trabajadores t
                            JOIN terapias p ON t.id_terapia = p.id
                            WHERE t.estado = 0`)
}

const getTerapeutaYTerapiaPorId = (id) => {
    return executeQueryOne(`SELECT t.id, t.nombre, t.apellidos, p.nombre_terapia
                        FROM trabajadores t
                        JOIN terapias p ON t.id_terapia = p.id
                        WHERE t.id = ${id} AND t.estado = 0`)
}

module.exports = {
    getAll,
    getById,
    getByIdUsuario,
    getByEmail,
    createWorker,
    updateById,
    deleteWorker,
    createUser,
    getTerapeutaYTerapia,
    getTerapeutaYTerapiaPorId,
    getEmailByIdDate
}