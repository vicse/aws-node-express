const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let contactoSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'Los apellidos son abligatorios']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatorio']
    },
    foto: {
        type: String,
        required: false
    }

});

contactoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Contacto', contactoSchema);