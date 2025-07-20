const multer = require('multer');
const path   = require('path');


const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'), // dossier ABSOLU
  filename   : (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

// Limite de 2 Mo, accepte uniquement les images
const fileFilter = (_, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Fichier non supporté'), false);
};

module.exports = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter });