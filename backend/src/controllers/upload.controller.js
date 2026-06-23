const multer = require('multer');
const path   = require('path');
const { v4: uuidv4 } = require('uuid');

// ── Almacenamiento en disco ────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Solo se permiten imágenes'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB por archivo
});

// ── POST /api/admin/upload — sube 1 o más imágenes ────────────
exports.uploadMiddleware = upload.array('images', 20);

exports.uploadImages = (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({ error: 'No se recibieron imágenes' });
  }

  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;

  const urls = req.files.map(f => ({
    url: `${baseUrl}/uploads/${f.filename}`,
    alt: f.originalname,
  }));

  res.json({ urls });
};
