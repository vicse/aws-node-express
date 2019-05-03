var express = require('express');
var router = express.Router();

const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let Contacto = require('../models/contacto');

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
    accessKeyId: 'AKIAQ3Y6DVPIDF5H7CCH',
    secretAccessKey: '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',
    Bucket: 'vicse-bucket-node'
});

/**
 * Single Upload
 */
const profileImgUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'vicse-bucket-node',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profileImage');


/**
 * Check File Type
 * @param file
 * @param cb
 * @return {*}
 */
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


/* GET home page. */
router.get('/', function(req, res, next) {

    Contacto.find((err, contactos) => {

        if (err) {
            console.log(err);
        } else {
            res.render('index', { contactos: contactos });
            console.log(contactos);
        }

    });
});

router.post('/', (req, res) => {

    let body = req.body;
    let file = body.archivo;

    profileImgUpload(req, res, (error) => {
        console.log('requestOkokok', file);
        console.log('error', error);
        if (error) {
            console.log('errors', error);
            res.json({ error: error });
        } else {
            // If File not found
            if (file === undefined) {
                console.log('Error: No File Selected!');
                res.json('Error: No File Selected');
            } else {
                // If Success
                const imageName = file.key;
                const imageLocation = file.location;
                // Save the file name into database into profile model
                console.log('Este es el archivo de aws' + imageLocation);

                let contacto = new Contacto({

                    nombre: body.nombre,
                    apellidos: body.apellidos,
                    email: body.email,
                    fechaNacimiento: body.fechaNacimiento,
                    foto: imageLocation

                });

                contacto.save((err, contactoDB) => {

                    if (err) {
                        console.log(err);
                    }

                    console.log('Se guardo con éxito el usuario');
                    res.redirect('/');

                });
            }
        }
    });

});

router.get('/edit/:id', (req, res) => {

    let id = req.params.id;

    Contacto.findById(id, (err, contacto) => {
        if (err) {
            console.log(err);
        } else {
            console.log(contacto);

            res.render('edit', { contacto });
        }

    });

});

router.post('/edit/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let newContact = {
        nombre: body.nombre,
        apellidos: body.apellidos,
        email: body.email,
        fechaNacimiento: body.fechaNacimiento
    }

    Contacto.findOneAndUpdate(id, newContact, (err, contactoDB) => {

        if (err) {
            console.log(err);
        }

        if (!contactoDB) {
            console.log('El id es incorrecto');
        }

        console.log('Se actualizo el contacto con éxito');

        res.redirect('/');

    });

});


router.get('/delete/:id', (req, res) => {

    let id = req.params.id;

    Contacto.findOneAndDelete(id, (err, contactoBorrado) => {

        if (err) {
            console.log(err);
            res.redirect('/')
        } else {
            res.redirect('/');
        }

    });

});



module.exports = router;