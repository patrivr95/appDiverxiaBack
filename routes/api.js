const router = require('express').Router()

const apiCita = require('./api/citas')
const apiUsuarios = require('./api/usuarios')
const apiTerapeutas = require('./api/terapeutas')
const apiClientes = require('./api/clientes')
const apiHorarios = require('./api/horarios')
const apiTerapias = require('./api/terapias')

// Usamos el router para ir formando la url con la que nos puedan hacer peticiones desde el front
router.use('/citas', apiCita)
router.use('/usuarios', apiUsuarios)
router.use('/terapeutas', apiTerapeutas)
router.use('/clientes', apiClientes)
router.use('/horarios', apiHorarios)
router.use('/terapias', apiTerapias)

module.exports = router