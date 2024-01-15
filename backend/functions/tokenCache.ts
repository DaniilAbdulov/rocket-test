const redis = require('redis');
const client = redis.createClient();
const axios = require('axios');
require('dotenv').config(); // Убедитесь, что подключили модуль dotenv для использования переменных среды (.env)

// Мидлвар должен применяться перед маршрутами, которым требуется доступ к токену
app.use(async (req, res, next) => {
  try {
    // Проверяем, есть ли сохраненный токен в Redis
    client.get('access_token', async (err, token) => {
      if (err) throw err;

      if (token) {
        // Если токен найден в Redis, используем его
        req.myAccessToken = token;
        next();
      } else {
        // Если токен не найден, отправляем запрос на получение нового токена
        const subdomain = process.env.SUBDOMAIN;
        const link = `https://${subdomain}.amocrm.ru/oauth2/access_token`;
        const data = {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code: process.env.CODE,
          redirect_uri: process.env.REDIRECT_URL,
        };

        const response = await axios.post(link, data);
        const accessToken = response.data.access_token;

        // Сохраняем новый токен в Redis с применением await и обработкой ошибок
        client.set('access_token', accessToken, 'EX', 3600, (setErr) => { // Срок жизни 1 час
          if (setErr) {
            throw setErr;
          }

          req.myAccessToken = accessToken;
          next();
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при работе с токеном.' });
  }
});
