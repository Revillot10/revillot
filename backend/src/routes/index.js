const router   = require('express').Router();
const auth     = require('../controllers/auth.controller');
const vehicles = require('../controllers/vehicles.controller');
const misc     = require('../controllers/misc.controller');
const upload   = require('../controllers/upload.controller');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

// ── Auth ───────────────────────────────────────────────────────
router.post('/auth/login',  auth.login);
router.get ('/auth/me',     authMiddleware, auth.me);
router.post('/auth/logout', auth.logout);
router.put ('/auth/change-password', authMiddleware, auth.changePassword);

// ── Public ────────────────────────────────────────────────────
router.get('/vehicles',          vehicles.getAll);
router.get('/vehicles/:id',      vehicles.getOne);
router.get('/brands',            vehicles.getBrands);
router.get('/articles',          misc.getArticles);
router.get('/articles/:slug',    misc.getArticle);
router.get('/videos',            misc.getVideos);
router.get('/testimonials',      misc.getTestimonials);
router.post('/leads',            misc.createLead);

// ── Admin ─────────────────────────────────────────────────────
router.use('/admin', authMiddleware);

router.get('/admin/dashboard',         misc.getDashboard);

// Upload de imágenes
router.post('/admin/upload', upload.uploadMiddleware, upload.uploadImages);

// Brands
router.get ('/admin/brands',           vehicles.adminGetBrands);
router.post('/admin/brands',           vehicles.createBrand);

// Vehicles
router.get   ('/admin/vehicles',        vehicles.adminGetAll);
router.post  ('/admin/vehicles',        vehicles.create);
router.put   ('/admin/vehicles/:id',    vehicles.update);
router.patch ('/admin/vehicles/:id/sold', vehicles.markSold);
router.delete('/admin/vehicles/:id',   requireAdmin, vehicles.delete);

// Articles
router.get   ('/admin/articles',        misc.adminGetArticles);
router.post  ('/admin/articles',        misc.createArticle);
router.put   ('/admin/articles/:id',    misc.updateArticle);
router.delete('/admin/articles/:id',    requireAdmin, misc.deleteArticle);

// Videos
router.get   ('/admin/videos',          misc.adminGetVideos);
router.post  ('/admin/videos',          misc.createVideo);
router.put   ('/admin/videos/:id',      misc.updateVideo);
router.delete('/admin/videos/:id',      requireAdmin, misc.deleteVideo);

// Leads
router.get   ('/admin/leads',           misc.adminGetLeads);
router.patch ('/admin/leads/:id',       misc.updateLead);

module.exports = router;
