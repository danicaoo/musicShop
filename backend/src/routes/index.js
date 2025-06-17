const express = require('express');
const router = express.Router();

// Импорт контроллеров
const albumController = require('../controllers/albumController');
const inventoryRoutes = require('./inventoryRoutes');

// Подключение подроутеров с единым префиксом /api
router.use('/albums', require('./albumRoutes'));
router.use('/musicians', require('./musicianRoutes'));
router.use('/ensembles', require('./ensembleRoutes'));
router.use('/sales', require('./saleRoutes'));
router.use('/recordings', require('./recordingRoutes'));
router.use('/inventories', inventoryRoutes);
router.use('/compositions', require('./compositionRoutes'));
router.get('/top-selling', albumController.getTopSellingAlbums);


// Health check
router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

router.get('/', (req, res) => {
  res.json({
    message: 'Music Shop API',
    version: '1.0',
    endpoints: {
      health: '/api/health',
      albums: '/api/albums',
      musicians: '/api/musicians',
      ensembles: '/api/ensembles',
      sales: '/api/sales',
      topSelling: '/api/top-selling'
    }
  });
});

// Обработка 404 для API
// Редирект для корневого пути
router.get('/', (req, res) => {
  res.redirect('/api');
});

module.exports = router;