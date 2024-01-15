import { Request, Response, NextFunction } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
global.access_token = "";

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (global.access_token) {
    req.myAccessToken = global.access_token;
    return next();
  }
  try {
    const subdomain = process.env.SUBDOMAIN;
    if (!subdomain) {
      return res
        .status(401)
        .json({ message: "Субдомен не задан в переменных окружения" });
    }
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
    global.access_token = response.data.access_token;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Не авторизован" });
  }
}
