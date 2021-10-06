const express = require('express');
const router = express.Router();

// Require al controlador  ¿?¿?
const asignatura_controller = require('../controllers/asignatura.controller');
const materialAsignatura_controller = require('../controllers/materialAsignatura.controller');

router.post('/nueva', asignatura_controller.asignatura_nueva);

router.post('/getSubjectByName', asignatura_controller.getSubjectByName);

router.post('/getSubjectByCode', asignatura_controller.getSubjectByCode);

router.post('/getAsignaturasNoVinculadas', asignatura_controller.getAsignaturasNoVinculadas);

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

//Materiales

router.post('/getSubjectDetail', asignatura_controller.getSubjectDetail);

router.post('/insertSubjectMaterial', materialAsignatura_controller.newSubjectMaterial);

router.post('/getSubjectMaterials', materialAsignatura_controller.getSubjectMaterials);

router.post('/getDetailSubjectMaterial', materialAsignatura_controller.getDetailSubjectMaterial);

router.post('/newHistorySubjectMaterial', materialAsignatura_controller.newHistorySubjectMaterial);

module.exports = router;
