const router = require('express').Router();
const dayjs = require('dayjs')
const Horario = require('../../models/horario.model')
const Terapeuta = require('../../models/terapeuta.model')


router.post('/hours', async (req, res) => {

  console.log(req.body)

  // obetenemos el día que el usario a seleccionada al pedir cita con dayjs para poder hacer combrobaciones
  const fecha = dayjs(req.body.dia);

  console.log(fecha)
  // obtenemos el dis de la semana correspondiente a ese día
  const diaDeLaSemana = fecha.day()
  console.log(diaDeLaSemana)
  // obtenemos si ese día corresponde a verano o invierno
  const esVerano = fecha.month() >= 5 && fecha.month() <= 8;
  // obtenemos el terapeuta que el usuario a elegido
  const terapeuta = await Terapeuta.getTerapeutaYTerapiaPorId(req.body.id_terapeuta)
  // comprobamos si este terapeuta es psicologo o no para usar un tramo horario de 60 de 45 minutos
  const esPsicologo = terapeuta.nombre_terapia === "Psicología"

  if (diaDeLaSemana === 1) {
    // El día de la semana es lunes
    if (esVerano) {
      // La fecha está en el rango de junio, julio, agosto y septiembre
      if (esPsicologo) {
        // Vas al psicologo
        // obtenemos los id de los tramos horarios que ya están reservados para ese día
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          // Mapeamos los IDs de los tramos horarios en un array para poder usarlos en la consulta, excluyendo estos datos
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorario60VeranoLunes(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_verano,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorario45VeranoLunes(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_verano,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    } else {
      // La fecha no está en el rango de junio, julio, agosto y septiembre
      if (esPsicologo) {
        // Vas al psicologo
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorario60InviernoLunes(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorario45InviernoLunes(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    }
  } else if (diaDeLaSemana > 1 && diaDeLaSemana < 5) {
    if (esVerano) {
      // La fecha está en el rango de junio, julio, agosto y septiembre;
      if (esPsicologo) {
        // Vas al psicologo
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios60verano(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_verano,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [[2000]]
        }
        // estoy aqui
        const horariosDisponibles = await Horario.getHorarios45verano(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_verano,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    } else {
      // La fecha no está en el rango de junio, julio, agosto y septiembre;
      if (esPsicologo) {
        // Vas al psicologo
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios60invierno(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios45invierno(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    }
  } else if (diaDeLaSemana === 5) {
    if (esVerano) {
      // La fecha está en el rango de junio, julio, agosto y septiembre;
      if (esPsicologo) {
        // Vas al psicologo
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorario60VeranoViernes(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_verano,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorario45VeranoViernes(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_verano,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    } else {
      // La fecha no está en el rango de junio, julio, agosto y septiembre;
      if (esPsicologo) {
        // Vas al psicologo
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios60invierno(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios45invierno(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_inicio_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    }
  } else if (diaDeLaSemana === 6) {
    if (esVerano) {
      // Es verano, no hay sabados;
      res.json('Es verano, no hay sabados')
    } else {
      // La fecha no está en el rango de junio, julio, agosto y septiembre
      if (esPsicologo) {
        // Vas al psicologo
        const idTramos = await Horario.getIdTramoHorario60(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_60);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios60sabado(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_sabado_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      } else {
        // No vas al psicologo')
        const idTramos = await Horario.getIdTramoHorario45(req.body.dia)
        let TramosArray
        if (idTramos != "") {
          TramosArray = idTramos.map(obj => obj.id_tramo_horario_45);
        } else {
          // Número fijo para no filtrar por nada en caso de que no tengamos horarios para ese día
          TramosArray = [2000]
        }
        const horariosDisponibles = await Horario.getHorarios45sabado(TramosArray)
        const horariosDisponiblesArray = horariosDisponibles.map(objeto => {
          return {
            "id": objeto.id,
            "hora_inicio": objeto.hora_sabado_invierno,
            "es_psicologo": esPsicologo
          };
        });
        res.json(horariosDisponiblesArray)
      }
    }
  } else {
    // esa fecha es domingo
    res.json('esa fecha es domingo')
  }

});

module.exports = router