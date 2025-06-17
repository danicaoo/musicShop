const express = require('express');
const router = express.Router();
const compositionController = require('../controllers/compositionController');

// Убедитесь, что все функции определены в контроллере
router.get('/', compositionController.getAllCompositions);
router.post('/', compositionController.createComposition);
router.get('/:id', compositionController.getCompositionById);
router.put('/:id', compositionController.updateComposition); // Если нужно
router.delete('/:id', compositionController.deleteComposition); // Если нужно

module.exports = router;