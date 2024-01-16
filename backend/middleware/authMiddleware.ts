import { Request, Response, NextFunction } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/*согласно документации amoCRM: 
'Токен должен быть доступен только вашему приложению, 
поэтому не рекомендуется сохранять его в cookies браузера,
открытых конфигурационных файлах и т. п.

Знаю, что сохранение токена таким способом не является хорошей практикой.
'*/
global.access_token = "";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //проверяем, установили ли мы токен доступа.
  if (global.access_token) {
    //Если установлен, то middleware переходит на leadsController
    return next();
  }
  //Если не установлен, то отправляем запрос на его получение
  try {
    const subdomain = process.env.SUBDOMAIN;
    //Проверка наличия субдомена
    if (!subdomain) {
      return res
        .status(401)
        .json({ message: "Субдомен не задан в переменных окружения" });
    }
    //Данные для получения токена согласно документации amoCRM
    const link = `https://${subdomain}.amocrm.ru/oauth2/access_token`;
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: process.env.CODE,
      redirect_uri: process.env.REDIRECT_URL,
    };
    const response = await axios.post(link, data);
    if (response.status !== 200) {
      return res
        .status(401)
        .json({ message: "Ошибка получения токена доступа" });
    }
    //в случае успешного получения токена, присваиваем его глобальному объекту
    global.access_token = response.data.access_token;
    global.refresh_token = response.data.refresh_token;
    global.access_toke_lifetime = response.data.expires_in;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Не авторизован" });
  }
}
