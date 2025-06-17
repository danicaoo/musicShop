const express = require('express');
const router = express.Router();
const musicianController = require('../controllers/musicianController');

// Роут поиска должен быть выше динамических параметров
router.get('/search', musicianController.searchMusicians);

// Остальные роуты
router.get('/', musicianController.getAllMusicians);
router.post('/', musicianController.createMusician);
router.put('/:id', musicianController.updateMusician);
router.get('/:id', musicianController.getMusicianById);

module.exports = router;