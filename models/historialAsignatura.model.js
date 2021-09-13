const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorialAsignaturaSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MaterialAsignatura'
    },
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura'
    },
    fecha: { type: String, required: true, max: 10 },
    hora: { type: String, required: true, max: 8 },
});

HistorialAsignaturaSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('HistorialAsignatura', HistorialAsignaturaSchema);