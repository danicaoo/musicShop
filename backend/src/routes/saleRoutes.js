const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

// Регистрация новой продажи
router.post('/', saleController.createSale);

// Получение отчета о продажах
router.get('/report', saleController.getSalesReport);

// Обновление продаж за прошлый год (админ)
router.post('/update-last-year', saleController.updateLastYearSales);

module.exports = router;