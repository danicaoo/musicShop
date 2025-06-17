# Этап сборки
FROM node:20.12.2-bookworm-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --ignore-scripts --frozen-lockfile
COPY . .
RUN npm run build

# Финальный образ с nginx
FROM nginx:1.25.4-alpine

# Удаляем дефолтную конфигурацию nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем сборку и конфигурацию
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Устанавливаем корректные права
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx