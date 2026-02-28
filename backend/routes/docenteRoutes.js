const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docentesController');

router.get('/', docenteController.getAllDocentes);
router.get('/:id', docenteController.getDocenteById);
router.post('/', docenteController.createDocente);
router.put('/:id', docenteController.updateDocente);
router.delete('/:id', docenteController.deleteDocente);

module.exports = router;