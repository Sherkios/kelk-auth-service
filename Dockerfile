# устанавливаем образ для контейнера
FROM node:22-alpine

# устанавливаем командную оболочку bash для выполнения операций внутри контейнера
RUN apk add --no-cache bash

# устанавливаем рабочую директорию
WORKDIR /app

COPY package.json package-lock.json ./

# устанавливаем указанные зависимости NPM на этапе установки образа
RUN npm install

CMD [ "npm", "run", "dev" ]