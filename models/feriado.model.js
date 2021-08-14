var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FeriadoSchema = new Schema({
	_id: mongoose.Schema.Types.ObjectId,
    fecha: {type: Date, required: true},
    motivo: {type: String, required: true}
});

FeriadoSchema.set('toJSON', {getters: true});

// Export the model
module.exports = mongoose.model('Feriado', FeriadoSchema);
