const express = require('express');
const router = express.Router();
const recordingController = require('../controllers/recordingController');

// Убедитесь, что пути начинаются с '/'
router.get('/', recordingController.getAllRecordings);
router.get('/search', recordingController.searchRecordings);
router.post('/', recordingController.createRecording);

module.exports = router;