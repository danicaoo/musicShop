const prisma = require('../utils/database');

// Добавляем реализацию функции getAllRecordings
exports.getAllRecordings = async (req, res) => {
  try {
    const recordings = await prisma.recording.findMany({
      include: {
        composition: true
      }
    });
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.searchRecordings = async (req, res) => {
  try {
    const { q } = req.query;
    
    const recordings = await prisma.recording.findMany({
      where: {
        OR: [
          { studio: { contains: q, mode: 'insensitive' } },
          { composition: { title: { contains: q, mode: 'insensitive' } } }
        ]
      },
      include: {
        composition: true
      },
      take: 10
    });
    
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRecording = async (req, res) => {
  try {
    const { compositionId, recordingDate, studio } = req.body;
    
    // Проверка существования композиции
    const composition = await prisma.composition.findUnique({
      where: { id: parseInt(compositionId) }
    });
    
    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    const recording = await prisma.recording.create({
      data: {
        compositionId: parseInt(compositionId),
        recordingDate: new Date(recordingDate),
        studio: studio || null
      },
      include: {
        composition: true
      }
    });

    res.status(201).json(recording);
  } catch (error) {
    console.error('Recording creation error:', error);
    res.status(400).json({ 
      error: 'Failed to create recording',
      details: error.message
    });
  }
};
