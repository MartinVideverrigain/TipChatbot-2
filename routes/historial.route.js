const express = require('express');
const router = express.Router();

const historial_controller = require('../controllers/historial.controller');

router.post('/insertUserHistory', historial_controller.historial_nuevo);


router.post('/getUserHistory', historial_controller.get_historial);

module.exports = router;