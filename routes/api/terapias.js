const router = require('express').Router();

const Actividad = require('../../models/terapia.model');

router.get('/', async (req, res) => {

    try {
        const result = await Actividad.getAll();
        res.json(result)
        
    } catch (error) {
        res.json({ err: error.message})
    }
    
});


router.get('/:idTerapia', async(req, res) => {

    const { idTerapia } = req.params;
    const result = await Actividad.getById(idTerapia);
    res.json(result);
})


module.exports = router