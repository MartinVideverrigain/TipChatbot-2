const express = require('express');
const router = express.Router();

// Require al controlador  ¿?¿?
const feriado_controller = require('../controllers/feriado.controller');


// Prueba

router.post('/nuevo', feriado_controller.feriado_nuevo);

router.post('/detalle', feriado_controller.feriado_detalle);

router.post('/listado', feriado_controller.feriado_listado);

router.post('/delete', feriado_controller.feriado_delete);

module.exports = router;
