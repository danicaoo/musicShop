const prisma = require('../utils/database');

exports.getAllCompositions = async (req, res) => {
  try {
    const compositions = await prisma.composition.findMany();
    res.json(compositions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createComposition = async (req, res) => {
  try {
    const { title, duration, creationYear, genre } = req.body;
    
    // Валидация данных
    if (!title || !duration) {
      return res.status(400).json({ error: 'Title and duration are required' });
    }

    const composition = await prisma.composition.create({
      data: {
        title,
        duration: parseInt(duration),
        creationYear: creationYear ? parseInt(creationYear) : null,
        genre: genre ? String(genre) : null // Убедимся, что genre - строка
      }
    });

    res.status(201).json(composition);
  } catch (error) {
    // Детальное логирование ошибки
    console.error('Detailed composition creation error:', {
      error: error.message,
      meta: error.meta,
      body: req.body
    });
    
    res.status(400).json({ 
      error: 'Failed to create composition',
      details: error.message,
      prismaMeta: error.meta
    });
  }
};

// Добавленная функция
exports.getCompositionById = async (req, res) => {
  try {
    const { id } = req.params;
    const composition = await prisma.composition.findUnique({
      where: { id: parseInt(id) }
    });

    if (!composition) {
      return res.status(404).json({ error: 'Composition not found' });
    }

    res.json(composition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Дополнительные функции по мере необходимости
exports.updateComposition = async (req, res) => {
  // Реализация обновления
};

exports.deleteComposition = async (req, res) => {
  // Реализация удаления
};