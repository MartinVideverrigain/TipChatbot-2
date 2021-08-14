const express = require('express');
const router = express.Router();

// Require al controlador  ¿?¿?
const pregunta_controller = require('../controllers/pregunta.controller');


// Prueba

router.post('/listado', pregunta_controller.pregunta_listado);

router.post('/nueva', pregunta_controller.pregunta_nueva);

router.post('/FAQcal1', pregunta_controller.pregunta_FAQcal1);

router.post('/FAQcal2', pregunta_controller.pregunta_FAQcal2);

router.post('/FAQcal3', pregunta_controller.pregunta_FAQcal3);

router.post('/FAQcal4', pregunta_controller.pregunta_FAQcal4);

router.post('/FAQcal5', pregunta_controller.pregunta_FAQcal5);

router.post('/FAQcal7', pregunta_controller.pregunta_FAQcal7);

router.post('/FAQcal8', pregunta_controller.pregunta_FAQcal8);

router.post('/FAQcal9', pregunta_controller.pregunta_FAQcal9);

router.post('/FAQcal10', pregunta_controller.pregunta_FAQcal10);

router.post('/FAQcal11', pregunta_controller.pregunta_FAQcal11);

router.post('/FAQcal12', pregunta_controller.pregunta_FAQcal12);

router.post('/FAQcal13', pregunta_controller.pregunta_FAQcal13);

module.exports = router;
