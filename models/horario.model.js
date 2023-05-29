const { executeQuery, executeQueryOne } = require("../helpers/utils")

const getIdTramoHorario45 = (dia) => {
  return executeQuery('SELECT id_tramo_horario_45 FROM citas WHERE dia = ? AND id_tramo_horario_45 IS NOT NULL AND citas.cancelada = 0', [dia])
}

const getIdTramoHorario60 = (dia) => {
  return executeQuery('SELECT id_tramo_horario_60 FROM citas WHERE dia = ? AND id_tramo_horario_60 IS NOT NULL AND citas.cancelada = 0', [dia])
}

const getHorario45InviernoLunes = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_invierno FROM tramo_horario_45 WHERE id NOT IN (${placeholders}) AND hora_inicio_invierno IS NOT NULL AND HOUR(hora_inicio_invierno) > 14;`
  return executeQuery(query, tramosArray);
}

const getHorario60InviernoLunes = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_invierno FROM tramo_horario_60 WHERE id NOT IN (${placeholders}) AND hora_inicio_invierno IS NOT NULL AND HOUR(hora_inicio_invierno) > 14;`
  return executeQuery(query, tramosArray);
}

const getHorario45VeranoLunes = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_verano FROM tramo_horario_45 WHERE id NOT IN (${placeholders}) AND hora_inicio_verano IS NOT NULL AND HOUR(hora_inicio_verano) > 14;`
  return executeQuery(query, tramosArray);
}

const getHorario60VeranoLunes = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_verano FROM tramo_horario_60 WHERE id NOT IN (${placeholders}) AND hora_inicio_verano IS NOT NULL AND HOUR(hora_inicio_verano) > 14;`
  return executeQuery(query, tramosArray);
}

const getHorario45VeranoViernes = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_verano FROM tramo_horario_45 WHERE id NOT IN (${placeholders}) AND hora_inicio_verano IS NOT NULL AND HOUR(hora_inicio_verano) < 14;`
  return executeQuery(query, tramosArray);
}

const getHorario60VeranoViernes = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_verano FROM tramo_horario_60 WHERE id NOT IN (${placeholders}) AND hora_inicio_verano IS NOT NULL AND HOUR(hora_inicio_verano) < 14;`
  return executeQuery(query, tramosArray);
}

const getHorarios45invierno = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_invierno FROM tramo_horario_45 WHERE id NOT IN (${placeholders}) AND hora_inicio_invierno IS NOT NULL;`
  return executeQuery(query, tramosArray);
};

const getHorarios45verano = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_verano FROM tramo_horario_45 WHERE id NOT IN (${placeholders}) AND hora_inicio_verano IS NOT NULL;`
  return executeQuery(query, tramosArray);
};

const getHorarios45sabado = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_sabado_invierno FROM tramo_horario_45 WHERE id NOT IN (${placeholders}) AND hora_sabado_invierno IS NOT NULL;`
  return executeQuery(query, tramosArray);
};
const getHorarios60invierno = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_invierno FROM tramo_horario_60 WHERE id NOT IN (${placeholders}) AND hora_inicio_invierno IS NOT NULL;`
  return executeQuery(query, tramosArray);
};

const getHorarios60verano = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_inicio_verano FROM tramo_horario_60 WHERE id NOT IN (${placeholders}) AND hora_inicio_verano IS NOT NULL;`
  return executeQuery(query, tramosArray);
};

const getHorarios60sabado = (tramosArray) => {
  const placeholders = tramosArray.map(() => '?').join(', ');
  const query = `SELECT id, hora_sabado_invierno FROM tramo_horario_60 WHERE id NOT IN (${placeholders}) AND hora_sabado_invierno IS NOT NULL`
  return executeQuery(query, tramosArray);
};

module.exports = {
  getIdTramoHorario45,
  getIdTramoHorario60,
  getHorario45InviernoLunes,
  getHorario60InviernoLunes,
  getHorario45VeranoLunes,
  getHorario60VeranoLunes,
  getHorario45VeranoViernes,
  getHorario60VeranoViernes,
  getHorarios45invierno,
  getHorarios45verano,
  getHorarios45sabado,
  getHorarios60invierno,
  getHorarios60sabado,
  getHorarios60verano

}