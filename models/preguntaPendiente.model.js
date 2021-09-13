var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreguntaPendienteSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
    pregunta: {type: String, required: true},
});

PreguntaPendienteSchema.set('toJSON', {getters: true});

module.exports = mongoose.model('PreguntaPendiente', PreguntaPendienteSchema);
