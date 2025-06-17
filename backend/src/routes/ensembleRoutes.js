const express = require('express');
const router = express.Router();
const ensembleController = require('../controllers/ensembleController');

router.get('/:ensembleId/compositions-count', ensembleController.getCompositionsCount);
router.get('/:ensembleId/albums', ensembleController.getEnsembleAlbums);
router.get('/', ensembleController.getAllEnsembles);
router.get('/search', ensembleController.searchEnsembles);
router.post('/', ensembleController.createEnsemble);




module.exports = router;