const express = require('express');
const router = express.Router();
const gradoController = require('../controllers/gradoController');

router.get('/', gradoController.getAllGrados);
router.get('/:id', gradoController.getGradoById);
router.post('/', gradoController.createGrado);
router.put('/:id', gradoController.updateGrado);
router.delete('/:id', gradoController.deleteGrado);

module.exports = router;