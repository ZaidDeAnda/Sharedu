var mongoose = require('mongoose');

var olimpiadaSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    requisitos: [String],
    imagen: String,
    fecha: String,
    isOpen: Boolean,
    encargado: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


module.exports = mongoose.model("Olimpiada", olimpiadaSchema);
