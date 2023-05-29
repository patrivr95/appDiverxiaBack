const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { response } = require('express');
const Actividad = require('../../models/terapeuta.model');


router.get('/', async (req, res) => {

    Actividad.getAll()
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.json({ err: error.message })
        });
});

router.get('/terapuetas-y-terapia', async (req, res) => {
    try {
        const result = await Actividad.getTerapeutaYTerapia();
        res.json(result)
    } catch (error) {
        res.json({ error: error.message })
    }

});

router.post('/createWorker', async (req, res) => {
    try {
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        const user = await Actividad.createUser(req.body);
        const result = await Actividad.createWorker(req.body, user.insertId);
        const { insertId } = result;
        const trabajador = await Actividad.getById(insertId);
        res.json(trabajador)

    } catch (error) {
        res.json({ error: error.message })
    }
});



router.put('/update/:idTrabajador', async (req, res) => {

    const { idTrabajador } = req.params;
    const result = await Actividad.updateById(idTrabajador, req.body);
    res.json(result);
});


router.delete('/delete/:idTrabajador', async (req, res) => {

    const { idTrabajador } = req.params;
    console.log('delete id', idTrabajador)
    const result = await Actividad.deleteWorker(idTrabajador);
    res.json(result);
});

router.get('/:idUsuario', async (req, res) => {

    const { idUsuario } = req.params;
    const result = await Actividad.getByIdUsuario(idUsuario);
    res.json(result);
});


module.exports = router