const prisma = require('./utils/database');

async function initTestData() {
  try {
    const existingAlbums = await prisma.album.findMany();
    if (existingAlbums.length > 0) {
      console.log('Test data already exists, skipping initialization');
      return;
    }
    // Создаем тестовых музыкантов
    const musician1 = await prisma.musician.upsert({
      where: { name: 'Иван Иванов' },
      update: {},
      create: {
        name: 'Иван Иванов',
        birthDate: new Date(1980, 0, 1),
        country: 'Россия',
        roles: ['VOCALIST', 'GUITARIST'],
      }
    });
   const musician2 = await prisma.musician.upsert({
      where: { name: 'Петр Петров Тест' },
      update: {},
      create: {
        name: 'Петр Петров Тест',
        birthDate: new Date(1985, 5, 15),
        country: 'Россия',
        roles: ['BASSIST'],
      }
    });
    // Создаем тестовый ансамбль
    const ensemble = await prisma.ensemble.create({
      data: {
        name: 'Рок-группа "Ветер"',
        formationDate: new Date(2000, 0, 1),
        type: 'BAND',
        members: {
          create: [
            {
              musicianId: musician1.id,
              role: 'Солист',
              startDate: new Date(2000, 0, 1)
            },
            {
              musicianId: musician2.id,
              role: 'Басист',
              startDate: new Date(2000, 0, 1)
            }
          ]
        }
      }
    });

    // Создаем тестовые композиции
    const compositions = [];
    for (let i = 1; i <= 5; i++) {
      const composition = await prisma.composition.create({
        data: {
          title: `Композиция ${i}`,
          duration: 180 + (i * 30),
          creationYear: 2000 + i,
          genre: ["Rock", "Pop", "Classical"][i % 3]
        }
      });
      compositions.push(composition);
    }
    
    // Создаем тестовые записи
    const recordings = [];
    for (let i = 0; i < 5; i++) {
      const recording = await prisma.recording.create({
        data: {
          recordingDate: new Date(2020, i % 12, (i % 28) + 1),
          studio: `Студия ${i + 1}`,
          compositionId: compositions[i].id
        }
      });
      recordings.push(recording);
    }
    
    // Создаем тестовый сольный альбом
    const soloAlbum = await prisma.album.create({
      data: {
        title: 'Сольный альбом',
        catalogNumber: 'SOLO-001',
        releaseDate: new Date(2022, 0, 15),
        musicianId: musician1.id,
        tracks: {
          create: [
            {
              position: 1,
              recordingId: recordings[0].id
            },
            {
              position: 2,
              recordingId: recordings[1].id
            }
          ]
        },
        inventories: {
          create: {
            wholesalePrice: 5.99,
            retailPrice: 9.99,
            lastYearSales: 100,
            currentYearSales: 50,
            unsold: 200
          }
        }
      }
    });

    // Создаем тестовый групповой альбом
    const bandAlbum = await prisma.album.create({
      data: {
        title: 'Групповой альбом',
        catalogNumber: 'BAND-001',
        releaseDate: new Date(2023, 3, 20),
        ensembleId: ensemble.id,
        tracks: {
          create: [
            {
              position: 1,
              recordingId: recordings[2].id
            },
            {
              position: 2,
              recordingId: recordings[3].id
            },
            {
              position: 3,
              recordingId: recordings[4].id
            }
          ]
        },
        inventories: {
          create: {
            wholesalePrice: 7.99,
            retailPrice: 12.99,
            lastYearSales: 200,
            currentYearSales: 150,
            unsold: 300
          }
        }
      }
    });

   const inventories = await prisma.inventory.findMany({
      where: {
        albumId: {
          in: [soloAlbum.id, bandAlbum.id]
        }
      }
    });

    // Создаем тестовые продажи
    const sales = [];
    
    // Продажи для сольного альбома
    for (let i = 0; i < 15; i++) {
      sales.push({
        inventoryId: inventories[0].id,
        quantity: Math.floor(Math.random() * 5) + 1,
        saleDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      });
    }
    
    // Продажи для группового альбома
    for (let i = 0; i < 25; i++) {
      sales.push({
        inventoryId: inventories[1].id,
        quantity: Math.floor(Math.random() * 3) + 1,
        saleDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      });
    }
    
    // Создаем продажи в базе данных
    await prisma.sale.createMany({
      data: sales
    });

    console.log('✅ Test sales created:', sales.length);
    
    // Обновляем инвентарь вручную (если триггер не сработал)
    const soloAlbumSales = sales
      .filter(s => s.inventoryId === inventories[0].id)
      .reduce((sum, sale) => sum + sale.quantity, 0);
    
    const bandAlbumSales = sales
      .filter(s => s.inventoryId === inventories[1].id)
      .reduce((sum, sale) => sum + sale.quantity, 0);
    
    await prisma.inventory.update({
      where: { id: inventories[0].id },
      data: {
        currentYearSales: { increment: soloAlbumSales },
        unsold: { decrement: soloAlbumSales }
      }
    });
    
    await prisma.inventory.update({
      where: { id: inventories[1].id },
      data: {
        currentYearSales: { increment: bandAlbumSales },
        unsold: { decrement: bandAlbumSales }
      }
    });

    console.log('✅ Inventory updated with sales data');
  } catch (error) {
    console.error('❌ Error initializing test data:', error);
  }
}
module.exports = initTestData;