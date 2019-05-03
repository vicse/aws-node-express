var express = require('express');
var router = express.Router();

let Contacto = require('../models/contacto');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


// router.post('/', (req, res) => {

//     let body = req.body;

//     let contacto = new Contacto({

//         nombre: body.nombre,
//         apellidos: body.apellidos,
//         email: body.email,
//         fechaNacimiento: body.fechaNacimiento

//     });

//     contacto.save((err, contactoDB) => {

//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }

//         res.json({
//             ok: true,
//             producto: productoDB
//         });

//     });

// });

module.exports = router;