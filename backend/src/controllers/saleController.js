const prisma = require('../utils/database');
const Joi = require('joi');

// Схема валидации для создания продажи
const saleSchema = Joi.object({
  inventoryId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required()
});

// Зарегистрировать новую продажу
exports.createSale = async (req, res) => {
  try {
    // Валидация
    const { error, value } = saleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { inventoryId, quantity } = value;

    // Проверка доступности инвентаря
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId }
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Инвентарь не найден' });
    }

    if (inventory.unsold < quantity) {
      return res.status(400).json({ 
        error: `Недостаточно товара на складе. Доступно: ${inventory.unsold}`
      });
    }

    // Создание продажи
    const sale = await prisma.sale.create({
      data: {
        inventoryId: inventoryId,
        quantity: quantity
      }
    });

    // Обновление инвентаря
    await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        currentYearSales: { increment: quantity },
        unsold: { decrement: quantity }
      }
    });

    res.status(201).json({
      ...sale,
      message: `Продажа успешно зарегистрирована. Обновленный остаток: ${inventory.unsold - quantity}`
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получить отчет о продажах

// Обновить продажи за прошлый год (административная функция)
exports.updateLastYearSales = async (req, res) => {
  try {
    // Проверка прав администратора
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Требуются права администратора' });
    }

    // Запрос на перенос данных
    const updateResult = await prisma.$executeRaw`
      UPDATE "Inventory"
      SET 
        "lastYearSales" = "currentYearSales",
        "currentYearSales" = 0
      WHERE "currentYearSales" > 0
    `;

    // Создаем событие для триггера
    await prisma.yearlyResetEvent.create({
      data: { description: 'Yearly sales reset' }
    });

    res.json({ 
      message: 'Продажи за прошлый год успешно обновлены',
      affectedRows: updateResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, minQuantity = 1 } = req.query;
    
    const where = {};
    
    if (startDate && endDate) {
      where.saleDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    if (minQuantity) {
      where.quantity = {
        gte: parseInt(minQuantity)
      };
    }
    
    const sales = await prisma.sale.findMany({
      where,
      include: {
        inventory: {
          include: {
            album: {
              include: {
                ensemble: true
              }
            }
          }
        }
      },
      orderBy: {
        saleDate: 'desc'
      }
    });

    // Расчет итогов
    const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (sale.quantity * sale.inventory.retailPrice), 
      0
    );

    res.json({
      sales,
      totalSales,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
