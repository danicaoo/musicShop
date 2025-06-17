const prisma = require('../utils/database');
const Joi = require('joi'); 
// Количество музыкальных произведений заданного ансамбля
exports.getCompositionsCount = async (req, res) => {
  try {
    const { ensembleId } = req.params;
    
    const count = await prisma.recording.count({
      where: {
        composition: {
          recordings: {
            some: {
              albums: {
                some: {
                  album: {
                    ensembleId: parseInt(ensembleId)
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Названия всех компакт-дисков ансамбля
exports.getEnsembleAlbums = async (req, res) => {
  try {
    const { ensembleId } = req.params;
    
    const albums = await prisma.album.findMany({
      where: { ensembleId: parseInt(ensembleId) },
      select: { title: true, catalogNumber: true }
    });

    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Лидеры продаж текущего года
exports.getTopSellingAlbums = async (req, res) => {
  try {
    // Реализация получения топ-продаж
    const topAlbums = await prisma.inventory.findMany({
      orderBy: { currentYearSales: 'desc' },
      take: 10,
      include: { 
        album: {
          include: {
            ensemble: true,
            label: true
          }
        } 
      }
    });

    res.json(topAlbums.map(item => ({
      id: item.id,
      title: item.album.title,
      catalogNumber: item.album.catalogNumber,
      ensemble: item.album.ensemble?.name || 'Не указан',
      label: item.album.label.name,
      sales: item.currentYearSales
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Добавление нового ансамбля
exports.createEnsemble = async (req, res) => {
  try {
    const { name, formationDate, type, members } = req.body;
    
    // Базовая валидация
    if (!name || !formationDate || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'At least one member is required' });
    }
    
    // Проверка существования музыкантов
    for (const member of members) {
      const musician = await prisma.musician.findUnique({
        where: { id: member.musicianId }
      });
      
      if (!musician) {
        return res.status(400).json({ 
          error: `Musician with ID ${member.musicianId} not found` 
        });
      }
    }
    
    const ensemble = await prisma.ensemble.create({
      data: {
        name,
        formationDate: new Date(formationDate),
        type,
        members: {
          create: members.map(member => ({
            musicianId: member.musicianId,
            role: member.role,
            startDate: new Date(member.startDate)
          }))
        }
      },
      include: { members: true }
    });

    res.status(201).json(ensemble);
  } catch (error) {
    console.error('Error creating ensemble:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEnsembles = async (req, res) => {
  try {
    const ensembles = await prisma.ensemble.findMany({
      include: {
        members: {
          include: {
            musician: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    res.json(ensembles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.searchEnsembles = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const ensembles = await prisma.ensemble.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive'
        }
      },
      take: 10
    });

    res.json(ensembles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
