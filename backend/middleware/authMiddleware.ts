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

      access_token = response.data.access_token;
      // setAccessToken(response.data.access_token);
      req.myAccessToken = response.data.access_token;
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
