const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorialAsignaturaSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    material: {
        type: Schema.Types.ObjectId,
        ref: 'MaterialAsignatura'
    },
    asignatura: {
        type: Schema.Types.ObjectId,
        ref: 'Asignatura'
    },
    fecha: { type: String, required: true, max: 10 },
    hora: { type: String, required: true, max: 8 },
});

HistorialAsignaturaSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('HistorialAsignatura', HistorialAsignaturaSchema);