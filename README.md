# Project-on-Express
Проект в рамках обучения в Я.Практикум для изучения Node.js (Express.js). В данном проекте реализованна серверная часть фотохостинга (аналог instagram).
Сервер умеет: авторизация, работа с карточками фото (получение, добавление, удаление, лайк, убрать лайк), работа с пользователями (получение всех пользователей, 
получение одного по ID, обновление пользовательских данных, создание пользователя).
В качестве БД используется MongoDB.

Ссылка на проект: https://github.com/Graev/Project-on-Express

Виды сборок:

"start": "node app.js" - запуск сервера
"dev": "nodemon app.js" - запуск сервера с hot-reload

Для сборки проекта использовались: 
    "dotenv": "^8.2.0",
    "eslint": "^6.6.0",
    "eslint-config-airbnb-base": "^14.0.0",
    "eslint-config-prettier": "^6.9.0",
    "eslint-plugin-import": "^2.18.2",
    "eslint-plugin-prettier": "^3.1.2",
    "nodemon": "^1.19.4",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "cookie-parser": "^1.4.4",
    "express": "^4.17.1",
    "helmet": "^3.21.2",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.8.9",
    "mongoose-validator": "^2.1.0"
