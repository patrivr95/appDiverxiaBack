const { executeQuery, executeQueryOne } = require("../helpers/utils")


const getAll = () => {

    return executeQuery('select * from citas');
};


const getById = (idDate) => {

    const query = `
    SELECT c.*, cl.nombre, cl.apellidos, cl.email, t.hora_inicio_verano, t.hora_inicio_invierno, t.hora_sabado_invierno, tt.hora_inicio_verano AS hora_inicio_verano_60, tt.hora_inicio_invierno AS hora_inicio_invierno_60, tt.hora_sabado_invierno AS hora_sabado_invierno_60, tp.nombre_terapia,
       tr.nombre AS terapeuta_nombre, tr.apellidos AS terapeuta_apellidos, tr.email AS terapeuta_email
    FROM citas c
    LEFT JOIN clientes cl ON c.id_usuario = cl.id_usuario
    LEFT JOIN tramo_horario_45 t ON c.id_tramo_horario_45 = t.id
    LEFT JOIN tramo_horario_60 tt ON c.id_tramo_horario_60 = tt.id
    LEFT JOIN trabajadores tr ON c.id_terapeuta = tr.id
    LEFT JOIN terapias tp ON tr.id_terapia = tp.id
    WHERE c.id = ?`;

    return executeQueryOne(query, [idDate]);
};


const getByTerapeuta45 = (idTerapeuta) => {
    const query = `
    SELECT c.*, cl.nombre, cl.apellidos, t.hora_inicio_verano, t.hora_inicio_invierno, t.hora_sabado_invierno, tp.nombre_terapia,
       tr.nombre AS terapeuta_nombre, tr.apellidos AS terapeuta_apellidos, tr.email AS terapeuta_email
    FROM citas c
    LEFT JOIN clientes cl ON c.id_usuario = cl.id_usuario
    LEFT JOIN tramo_horario_45 t ON c.id_tramo_horario_45 = t.id
    LEFT JOIN trabajadores tr ON c.id_terapeuta = tr.id
    LEFT JOIN terapias tp ON tr.id_terapia = tp.id
    WHERE c.id_terapeuta = ? AND c.cancelada = 0
    ORDER BY c.dia ASC, c.id_tramo_horario_45 ASC
  `;

    return executeQuery(query, [idTerapeuta]);
};

const getByTerapeuta60 = (idTerapeuta) => {
    const query = `
    SELECT c.*, cl.nombre, cl.apellidos, t.hora_inicio_verano, t.hora_inicio_invierno, t.hora_sabado_invierno, tp.nombre_terapia,
       tr.nombre AS terapeuta_nombre, tr.apellidos AS terapeuta_apellidos, tr.email AS terapeuta_email
    FROM citas c
    LEFT JOIN clientes cl ON c.id_usuario = cl.id_usuario
    LEFT JOIN tramo_horario_60 t ON c.id_tramo_horario_60 = t.id
    LEFT JOIN trabajadores tr ON c.id_terapeuta = tr.id
    LEFT JOIN terapias tp ON tr.id_terapia = tp.id
    WHERE c.id_terapeuta = ? AND c.cancelada = 0
    ORDER BY c.dia ASC, c.id_tramo_horario_60 ASC
  `;

    return executeQuery(query, [idTerapeuta]);
};

const getByCliente = (idCliente) => {
    const query = `
    SELECT c.*, cl.nombre, cl.apellidos, t.hora_inicio_verano, t.hora_inicio_invierno, t.hora_sabado_invierno, tt.hora_inicio_verano AS hora_inicio_verano_60, tt.hora_inicio_invierno AS hora_inicio_invierno_60, tt.hora_sabado_invierno AS hora_sabado_invierno_60, tp.nombre_terapia,
       tr.nombre AS terapeuta_nombre, tr.apellidos AS terapeuta_apellidos, tr.email AS terapeuta_email
    FROM citas c
    LEFT JOIN clientes cl ON c.id_usuario = cl.id_usuario
    LEFT JOIN tramo_horario_45 t ON c.id_tramo_horario_45 = t.id
    LEFT JOIN tramo_horario_60 tt ON c.id_tramo_horario_60 = tt.id
    LEFT JOIN trabajadores tr ON c.id_terapeuta = tr.id
    LEFT JOIN terapias tp ON tr.id_terapia = tp.id
    WHERE c.id_usuario = ? AND c.cancelada = 0
    ORDER BY c.dia ASC, c.id_tramo_horario_45 ASC, c.id_tramo_horario_60 ASC
  `;

    return executeQuery(query, [idCliente]);
};


const deleteById = (id) => {

    return executeQueryOne('UPDATE citas SET cancelada = 1 WHERE id = ?; ', [id])
};


const createDate = ({ dia, id_terapeuta, id_usuario, id_tramo_horario_45 = null, id_tramo_horario_60 = null }) => {

    return executeQuery('insert into citas (dia, id_terapeuta, id_usuario, id_tramo_horario_45, id_tramo_horario_60) values (?, ?, ?, ?, ?)', [dia, id_terapeuta, id_usuario, id_tramo_horario_45, id_tramo_horario_60])
};






module.exports = {
    getAll,
    getById,
    getByTerapeuta45,
    getByTerapeuta60,
    getByCliente,
    deleteById,
    createDate
}