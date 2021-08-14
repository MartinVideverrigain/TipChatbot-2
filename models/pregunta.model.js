var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreguntaSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
    pregunta: {type: String, required: true},
    respuesta: {type: String, required: true}
});

PreguntaSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('Pregunta', PreguntaSchema);
