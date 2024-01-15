import { Request, Response, NextFunction } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
// import { setAccessToken, getAccessToken } from "../functions/tokenCache";

// const access_token = getAccessToken();
let access_token = "";
export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //const access_token = process.env.ACCESS_TOKEN
  if (access_token) {
    req.myAccessToken = access_token;
    return next();
  }
  try {
    const subdomain = process.env.SUBDOMAIN;
    const link = `https://${subdomain}.amocrm.ru/oauth2/access_token`;
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: process.env.CODE,
      redirect_uri: process.env.REDIRECT_URL,
    };
    console.log("Пытаюсь отправиь запрос");
    try {
      const response = await axios.post(link, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      //process.env.ACCESS_TOKEN = response.data.access_token
      access_token = response.data.access_token;
      // setAccessToken(response.data.access_token);
      req.myAccessToken = access_token;
      console.log(`Авторизация прошла успешно`);
    } catch (err) {
      console.error(err?.response?.data?.hint);
      return res.status(500).send(`Ошибка: ${err?.message}`);
    }
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Не авторизован" });
  }
}







const express = require('express');
const axios = require('axios');
const redis = require('redis');
const jwt = require('jsonwebtoken');

const app = express();
const client = redis.createClient();

// Обработчик для получения и сохранения access токена
app.get('/token', async (req, res) => {
  try {
    // Проверяем, есть ли сохраненный токен в Redis
    client.get('access_token', async (err, token) => {
      if (err) throw err;

      if (token) {
        // Если токен найден в Redis, используем его
        res.json({ access_token: token });
      } else {
        // Если токен не найден, отправляем запрос на получение нового токена
        const response = await axios.post('https://example.com/oauth/token', {
          // Добавьте параметры аутентификации, если это необходимо
        });

        const accessToken = response.data.access_token;
        
        // Сохраняем токен в Redis для последующего использования
        client.set('access_token', accessToken);

        res.json({ access_token: accessToken });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(3000, () => {
  console.log('Сервер запущен');
});


