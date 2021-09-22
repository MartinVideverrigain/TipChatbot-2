const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorialChatSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    pregunta:{type: String, required: true, max: 250},
    respuesta:{type: String, required: true, max: 250},
    fecha: {type: String, required: true, max: 10},
    hora: {type: String, required: true, max: 8},
    codAsignatura: {type: String, required: false, max: 8}
});


HistorialChatSchema.set('toJSON', {getters: true});

module.exports = mongoose.model('HistorialChat', HistorialChatSchema);