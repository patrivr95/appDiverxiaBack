const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { response } = require('express');

const Cliente = require('../../models/cliente.model');
const Citas = require('../../models/cliente.model');



router.get('/', async (req, res) => {

    Cliente.getAll()
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.json({ err: error.message })
        });
});

router.post('/create', async (req, res) => {

    try {

        const { username, password } = req.body;

        // Si la contraseña está presente, aplicar bcrypt.hashSync
        const hashedPassword = password ? bcrypt.hashSync(password, 12) : null;

        // req.body.password = bcrypt.hashSync(req.body.password, 12);
        const user = await Cliente.createClientUser({ username, password: hashedPassword });
        const result = await Cliente.createClient(req.body, user.insertId);
        const { insertId } = result;
        const cliente = await Cliente.getById(insertId);
        res.json(cliente)

    } catch (error) {
        res.json({ error: error.message })
    }
});

router.post('/citas/create', async (req, res) => {

    try {
        const result = await Citas.createDateClient(req.body);
        console.log(result);
        const { insertId } = result;
        const cita = await Citas.getByIdDate(insertId)
        res.json(cita)

    } catch (error) {
        res.json({ error: error.message })
    }
});

router.put('/updated/:emailCliente', async (req, res) => {

    try {
        req.body.password = bcrypt.hashSync(req.body.password, 12);
        const { emailCliente } = req.params;
        /* console.log('linea56', emailCliente)
        console.log('linea57', req.body); */
        const result = await Cliente.updateByEmail(req.body, emailCliente);
        /* console.log('linea57 result', result) */
        res.json(result)
        
    } catch (error) {
        res.json({ error: error.message })
    }

});


router.put('/update/:idCliente', async (req, res) => {

    const { idCliente } = req.params;
    const result = await Cliente.updateById(idCliente, req.body);
    res.json(result);
});



router.delete('/delete/:idCliente', async (req, res) => {

    const { idCliente } = req.params;
    await Cliente.deleteClient(idCliente, req.body);
    res.send(`Ha sido eliminado el cliente con id: ${idCliente}`);
});


router.delete('/citas/delete/:idDate', async (req, res) => {

    const { idDate } = req.params;
    console.log(idDate);
    const result = await Citas.deleteByIdDate(idDate);
    console.log(result);
    res.json(`Ha sido eliminada la cita con id: ${idDate}`);
});

router.get('/citas/:idUsuario', async (req, res) => {
    try {
        const { idUsuario } = req.params;
        console.log(idUsuario);
        const result = await Citas.getDateByIdClient(idUsuario);
        console.log(result);
        res.json(result);

    } catch (error) {
        res.json({ error: error.message })
    }
});

router.get('/getClient', async (req, res) => {
    try {
        console.log(req.query)
        const result = await Cliente.getByEmail(req.query.email)
        res.json(result)
    } catch (error) {
        res.json({ error: error.message })
    }

})

router.get('/getClientByEmail/:email', async (req, res) => {

    try {
        const { email } = req.params;
        const result = await Cliente.getByEmail(email);
        res.json(result);
    } catch (error) {
        res.json({ error: error.message })
    }
})

router.get('/:idUsuario', async (req, res) => {

    const { idUsuario } = req.params;
    const result = await Cliente.getByIdUsuario(idUsuario);
    res.json(result);
});




module.exports = router