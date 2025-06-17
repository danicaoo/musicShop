const prisma = require('../utils/database');

exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        album: {
          include: {
            ensemble: true,
            musician: true
          }
        }
      }
    });
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};