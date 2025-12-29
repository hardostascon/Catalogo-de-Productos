const express = require('express');
const router = express.Router();
const CsvController = require('../Controllers/CsvController');
const upload = require('../Config/multer');
const { auth } = require('../middelwares/auth.js');

// Rutas protegidas para carga de CSV
router.post('/productos/productosMasivo', auth, upload.single('file'), CsvController.uploadProductos);
//router.post('/categorias', auth, upload.single('file'), CsvController.uploadCategorias);

module.exports = router;