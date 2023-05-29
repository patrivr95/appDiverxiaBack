const { executeQuery, executeQueryOne } = require("../helpers/utils")

const getAll = () => {

  return executeQuery('SELECT clientes.id , clientes.nombre, clientes.apellidos, clientes.email, clientes.telefono, clientes.id_usuario, usuarios.username, usuarios.rol FROM clientes JOIN usuarios ON clientes.id_usuario = usuarios.id')
};


// creamos la función createClientUser para crear un usuario en nuestra BBDD
const createClientUser = ({ username = null, password = null }) => {

  return executeQuery('insert into usuarios (username, password, rol) values (?, ?, "usuario")', [username, password]);
};


// creamos la función createClient para crear un cliente en nuestra BBDD
const createClient = ({ nombre, apellidos, email, telefono }, id_usuario) => {

  return executeQuery('insert into clientes (nombre, apellidos, email, telefono, id_usuario) values (?, ?, ?, ?, ?)', [nombre, apellidos, email, telefono, id_usuario]);
};

// creamos la función getByEmail con el parámetro email para recuperar el usuario según el email
const getByEmail = (email) => {

  return executeQueryOne('SELECT clientes.id, clientes.nombre, clientes.apellidos, clientes.email, clientes.telefono, clientes.id_usuario, usuarios.username, usuarios.rol FROM clientes JOIN usuarios ON clientes.id_usuario = usuarios.id WHERE clientes.email = ?', [email])
};

const getById = (id) => {
  return executeQueryOne('select * from clientes where id = ?', [id])
}

const getEmailByIdDate = (idDate) => {
  return executeQueryOne(`SELECT clientes.email 
                          FROM clientes 
                          INNER JOIN citas ON clientes.id_usuario = citas.id_usuario 
                          WHERE citas.id = ?`, [idDate])
}

const getEmailsNotInIdDate = (idDate) => {
  return executeQuery(`SELECT DISTINCT clientes.email
                      FROM citas
                      INNER JOIN clientes ON citas.id_usuario = clientes.id_usuario
                      WHERE citas.id_terapeuta = (
                          SELECT id_terapeuta
                          FROM citas
                          WHERE id = ?
                      ) AND clientes.id_usuario != (
                          SELECT id_usuario
                          FROM citas
                          WHERE id = ?
                      )`, [idDate, idDate])
}


const getByIdUsuario = (idUsuario) => {

  return executeQueryOne('select clientes.id, clientes.nombre, clientes.apellidos, clientes.email, clientes.telefono, clientes.id_usuario from clientes where clientes.id_usuario = ?', [idUsuario]);
};


// creamos la función updateById para modificar los datos de un cliente según su id
const updateById = (idCliente, { nombre, apellidos, email, telefono }) => {

  return executeQuery('update clientes set nombre = ?, apellidos = ?, email = ?, telefono = ? where id = ?', [nombre, apellidos, email, telefono, idCliente]);
};


// creamos la función deleteClient para borrar a un cliente según su id
const deleteClient = (idCliente) => {

  return executeQueryOne('delete from clientes where id = ?', [idCliente]);
};

// creamos la función getByIdClient para recuperar las citas por usuario-cliente
const getDateByIdClient = (idUsuario) => {
  return executeQuery('SELECT * FROM citas WHERE id_usuario = ?', [idUsuario])
}

// creamos la funcion createDateClient para crear una nueva cita para cliente
const createDateClient = ({ dia, id_terapeuta, id_usuario, id_tramo_horario_45 = null, id_tramo_horario_60 = null }) => {

  return executeQuery('insert into citas (dia, id_terapeuta, id_usuario, id_tramo_horario_45, id_tramo_horario_60) values (?, ?, ?, ?, ?)', [dia, id_terapeuta, id_usuario, id_tramo_horario_45, id_tramo_horario_60])
};

const getByIdDate = (idDate) => {


  return executeQueryOne('select * from citas where id = ?', [idDate])
};


const updateByEmail = ({ username, password, nombre, apellidos, telefono }, emailCliente) => {

  /* console.log('query.clientemodel', username, password, nombre, apellidos, telefono, emailCliente);  */

  return executeQuery(` UPDATE clientes INNER JOIN usuarios ON clientes.id_usuario = usuarios.id SET usuarios.username = ?, usuarios.password = ?, clientes.nombre = ?, clientes.apellidos = ?, clientes.telefono = ? WHERE clientes.email = ? `, [username, password, nombre, apellidos, telefono, emailCliente]);
};




module.exports = {
  getAll,
  createClientUser,
  createClient,
  getByEmail,
  getByIdUsuario,
  updateById,
  getAll,
  deleteClient,
  getDateByIdClient,
  createDateClient,
  getByIdDate,
  getById,
  getEmailByIdDate,
  getEmailsNotInIdDate,
  updateByEmail
}