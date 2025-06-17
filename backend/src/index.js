const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./utils/database');
const path = require('path');
const initTestData = require('./initDb');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Настройка CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3331',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});


// Подключение роутера
app.use('/api', require('./routes')); // Важно: подключаем к корневому пути

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Проверка подключения к БД
prisma.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
    
    // Инициализация тестовых данных
    initTestData();
    
    // Запуск сервера
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
