const prisma = require('../utils/database');
const validRoles = ['VOCALIST', 'GUITARIST', 'BASSIST', 'DRUMMER', 'KEYBOARDIST', 'COMPOSER', 'CONDUCTOR', 'PRODUCER'];
const Joi = require('joi'); 

// Создать нового музыканта
exports.createMusician = async (req, res) => {
  try {
    const { name, birthDate, country, bio, roles } = req.body;
    if (roles && roles.some(role => !validRoles.includes(role))) {
      return res.status(400).json({ error: 'Invalid role provided' });
    }
    const musician = await prisma.musician.create({
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        country,
        bio,
        roles: roles || []
      }
    });

    res.status(201).json(musician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Обновить информацию о музыканте
exports.updateMusician = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Преобразование даты, если она есть в данных
    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }
    
    const musician = await prisma.musician.update({
      where: { id: parseInt(id) },
      data
    });

    res.json(musician);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получить всех музыкантов
// Получить всех музыкантов
exports.getAllMusicians = async (req, res) => {
  try {
    const musicians = await prisma.musician.findMany({
      include: {
        ensembles: {
          include: {
            ensemble: true
          }
        }
      }
    });

    res.json(musicians);
  } catch (error) {
    console.error('Error fetching musicians:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};

// Получить музыканта по ID
exports.getMusicianById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const musician = await prisma.musician.findUnique({
      where: { id: parseInt(id) },
      include: {
        ensembles: {
          include: {
            ensemble: true
          }
        }
      }
    });

    if (!musician) {
      return res.status(404).json({ error: 'Musician not found' });
    }

    res.json(musician);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Найти музыкантов по имени
// В searchMusicians
exports.searchMusicians = async (req, res) => {
  try {
    const { q } = req.query; // Используем параметр q
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const musicians = await prisma.musician.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      },
      take: 10
    });

    res.json(musicians);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};