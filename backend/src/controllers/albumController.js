const prisma = require('../utils/database');
const Joi = require('joi'); // Добавьте эту строку
// Для создания ансамбля

const albumSchema = Joi.object({
  title: Joi.string().required(),
  catalogNumber: Joi.string().required(),
  releaseDate: Joi.date().required(),
  ensembleId: Joi.number().integer().allow(null),
  tracks: Joi.array().items(
    Joi.object({
      position: Joi.number().integer().required(),
      recordingId: Joi.number().integer().required()
    })
  ).min(1)
});
// Упрощенная функция createAlbum без лейбла
exports.createAlbum = async (req, res) => {
  try {
    const { title, catalogNumber, releaseDate, musicianId, ensembleId, tracks, inventoryData } = req.body;
    
    // Упрощенная валидация
    if (!title || !catalogNumber || !releaseDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, catalogNumber, releaseDate' 
      });
    }

    // Создание альбома без проверки уникальности catalogNumber
    const album = await prisma.album.create({
      data: {
        title,
        catalogNumber,
        releaseDate: new Date(releaseDate),
        musicianId: musicianId ? parseInt(musicianId) : null,
        ensembleId: ensembleId ? parseInt(ensembleId) : null,
        inventories: {
          create: {
            wholesalePrice: inventoryData.wholesalePrice,
            retailPrice: inventoryData.retailPrice,
            lastYearSales: 0,
            currentYearSales: 0,
            unsold: inventoryData.initialQuantity
          }
        }
      }
    });

    // Создание треков
    for (const track of tracks) {
      await prisma.track.create({
        data: {
          albumId: album.id,
          position: parseInt(track.position),
          recordingId: parseInt(track.recordingId)
        }
      });
    }
    
    // Получение полного альбома
    const fullAlbum = await prisma.album.findUnique({
      where: { id: album.id },
      include: {
        tracks: true,
        inventories: true
      }
    });
    
    res.status(201).json(fullAlbum);
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(400).json({ 
      error: 'Failed to create album',
      details: error.message
    });
  }
};

// Аналогично обновить getAlbumById, searchAlbums, getTopSellingAlbums
// Обновить информацию об альбоме
exports.updateAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Преобразование даты, если она есть в данных
    if (data.releaseDate) {
      data.releaseDate = new Date(data.releaseDate);
    }
    
    const album = await prisma.album.update({
      where: { id: parseInt(id) },
      data
    });

    res.json(album);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получить все альбомы
exports.getAllAlbums = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const skip = (page - 1) * pageSize;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        skip,
        take: pageSize,
        include: {
          ensemble: { select: { name: true } },
          inventories: true
        },
        orderBy: { releaseDate: 'desc' }
      }),
      prisma.album.count()
    ]);

    res.json({
      data: albums,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Получить альбом по ID
exports.getAlbumById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const album = await prisma.album.findUnique({
      where: { id: parseInt(id) },
      include: {
        ensemble: true,
        tracks: {
          include: {
            recording: {
              include: {
                composition: true
              }
            }
          }
        },
        inventories: true
      }
    });

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Обновить инвентарную информацию
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { wholesalePrice, retailPrice, unsold } = req.body;
    
    // Валидация входных данных
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }
    
    if (isNaN(parseFloat(wholesalePrice)) || 
        isNaN(parseFloat(retailPrice)) || 
        isNaN(parseInt(unsold))) {
      return res.status(400).json({ error: 'Неверные числовые значения' });
    }
    
    // Обновление инвентаря
    const inventory = await prisma.inventory.update({
      where: { id: parseInt(id) },
      data: {
        wholesalePrice: parseFloat(wholesalePrice),
        retailPrice: parseFloat(retailPrice),
        unsold: parseInt(unsold)
      }
    });

    res.json(inventory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Добавьте функцию searchAlbums
exports.searchAlbums = async (req, res) => {
  try {
    const { q } = req.query;
    console.log(`Search query: ${q}`); // Для отладки
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters' });
    }

    const albums = await prisma.album.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { catalogNumber: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        ensemble: { select: { name: true } },
        inventories: true
      },
      take: 20
    });

    console.log(`Found ${albums.length} albums`); // Для отладки
    res.json(albums);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTopSellingAlbums = async (req, res) => {
  try {
    const topAlbums = await prisma.inventory.findMany({
      orderBy: { currentYearSales: 'desc' },
      take: 10,
      include: { 
        album: {
          include: {
            ensemble: true,
          }
        } 
      }
    });

    // Безопасный доступ к свойствам
    res.json(topAlbums.map(item => ({
      id: item.id,
      albumTitle: item.album?.title || 'Неизвестно',
      catalogNumber: item.album?.catalogNumber || 'N/A',
      ensembleName: item.album?.ensemble?.name || 'Не указан',
      currentYearSales: item.currentYearSales,
      retailPrice: item.retailPrice,
      wholesalePrice: item.wholesalePrice,
      unsold: item.unsold,
      lastYearSales: item.lastYearSales
    })));
  } catch (error) {
    console.error('Error fetching top selling albums:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

exports.checkCatalogNumber = async (req, res) => {
  // Всегда возвращаем что номер доступен
  res.json({ 
    available: true,
    message: 'Номер доступен (проверка отключена)'
  });
};