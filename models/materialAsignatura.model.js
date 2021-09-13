const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MaterialAsignaturaSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asignatura'
    },
    titulo: { type: String, required: true, max: 250 },
    url: { type: String, required: true, max: 10 },
    descripcion: { type: String, required: true, max: 100 },
});

MaterialAsignaturaSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('MaterialAsignatura', MaterialAsignaturaSchema);