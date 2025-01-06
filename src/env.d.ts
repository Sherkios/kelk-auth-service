declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_PORT?: string; // Порт, на котором запускается приложение
    DB_USER: string; // Пользователь базы данных
    DB_PASSWORD: string; // Пароль базы данных
    DB_HOST: string; // Хост базы данных
    DB_NAME: string; // Название базы данных
    DB_PORT?: string; // Порт базы данных
    JWT_SECRET: string; // Секрет для токенов
    JWT_REFRESH_SECRET: string; // Секрет для refresh токенов
  }
}
