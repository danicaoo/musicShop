# Используем официальный образ Node.js
FROM node:20.12.2-alpine3.19

# Создаем непривилегированного пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
WORKDIR /home/appuser/app

# Копируем только package.json сначала для кэширования зависимостей
COPY --chown=appuser:appgroup package*.json ./

# Устанавливаем зависимости
RUN npm install --omit=dev --ignore-scripts --frozen-lockfile

# Копируем остальные файлы
COPY --chown=appuser:appgroup . .

# Команда запуска
CMD ["npm", "start"]