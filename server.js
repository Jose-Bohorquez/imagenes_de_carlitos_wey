const express = require('express');
const multer = require('multer');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para manejar rutas públicas
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de multer para almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = moment().format('YYYY-MM-DD_HH-mm-ss');
    const dir = path.join(__dirname, 'imagenesx', folderName);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Verifica el tipo de archivo
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten imágenes'), false);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // Limita el tamaño del archivo a 5MB (opcional)
}).array('images');

// Ruta para subir imágenes
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // Si hubo un error, enviamos un mensaje de error detallado
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
