const express = require('express');
const router = express.Router();

// Require al controlador  ¿?¿?
const asignatura_controller = require('../controllers/asignatura.controller');


// Prueba
router.post('/nueva', asignatura_controller.asignatura_nueva);

router.post('/nuevaPrevia', asignatura_controller.asignatura_nuevaPrevia);

router.post('/nuevoHorario', asignatura_controller.asignatura_nuevoHorario);

router.post('/nuevaEvaluacion', asignatura_controller.asignatura_nuevaEvaluacion);

router.post('/listado', asignatura_controller.asignatura_listado);

router.post('/detalle', asignatura_controller.asignatura_details);

router.post('/update', asignatura_controller.asignatura_update);

router.post('/delete', asignatura_controller.asignatura_delete);

router.post('/deleteHorario', asignatura_controller.asignatura_deleteHorario);

router.post('/updateHorario', asignatura_controller.asignatura_updateHorario);

router.post('/detalleHorario', asignatura_controller.asignatura_detalleHorario);

router.post('/deletePrevia', asignatura_controller.asignatura_deletePrevia);

router.post('/deleteEvaluacion', asignatura_controller.asignatura_deleteEvaluacion);

router.post('/detalleEvaluacion', asignatura_controller.asignatura_detalleEvaluacion);

module.exports = router;
