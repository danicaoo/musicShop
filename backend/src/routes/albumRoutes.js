const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');

// Убедитесь, что этот роут идет ПЕРЕМ динамическими параметрами
router.get('/search', albumController.searchAlbums);

// Остальные роуты
router.post('/', albumController.createAlbum);
router.put('/:id', albumController.updateAlbum);
router.get('/', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbumById);
router.put('/inventory/:id', albumController.updateInventory);

module.exports = router;