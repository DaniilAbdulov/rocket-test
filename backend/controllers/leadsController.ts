import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { getCurrentData } from "../functions/getCurrentData";

dotenv.config();

const API_BASE_URL = `https://${process.env.SUBDOMAIN}.amocrm.ru`;

class LeadsController {
  totalRows: number = 0;

  private async getResponseBody(url: string, token: string, params?: any) {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      if (!this.totalRows) {
        this.totalRows = response.data._total_items;
      }
      return response.data._embedded;
    } catch (error) {
      console.error("Error making API request", error);
      throw new Error("Ошибка сервера при выполнении запроса к API.");
    }
  }

  public getData = async (req: Request, res: Response) => {
    const leadsUrl = API_BASE_URL + "/api/v4/leads";
    try {
      //получаем токен для запросов
      const token = req.myAccessToken;
      if (!token) {
        return res.status(422).json({ message: "Некорректный токен" });
      }
      //данные для запроса с определлными условиями
      const page = parseInt(req.query._page);
      const limit = parseInt(req.query._limit);
      const query = req.query.q;
      if (typeof page !== "number" || typeof limit !== "number") {
        return res
          .status(422)
          .json({ message: "Некорректные данные пагинации" });
      }
      //получаем список сделок с определенными параметрами
      const { leads } = await this.getResponseBody(leadsUrl, token, {
        with: "contacts",
        page,
        limit,
        query,
      });

      if (!leads || leads.length === 0) {
        // Returning an empty array for no leads (HTTP 200)
        return res.status(200).json({ results: [], totalRows: 0 });
      }

      //получем id воронки со сделками
      const pipelineId: number = leads[0].pipeline_id;
      if (!pipelineId || typeof pipelineId !== "number") {
        return res.status(422).json({ message: "Некорректный id воронки" });
      }

      //получаем список статусов сделок
      const statusesUrl =
        API_BASE_URL + `/api/v4/leads/pipelines/${pipelineId}/statuses`;
      const { statuses } = await this.getResponseBody(statusesUrl, token);

      //получаем список пользователей
      const usersUrl = API_BASE_URL + `/api/v4/users`;
      const { users } = await this.getResponseBody(usersUrl, token);

      //получаем список контаков
      const contactsUrl = API_BASE_URL + `/api/v4/contacts`;
      const { contacts } = await this.getResponseBody(contactsUrl, token, {
        with: "catalog_elements",
      });

      //форматируем полученные данные для отрисовки в таблице
      const data = getCurrentData(leads, statuses, users, contacts);

      //отправляем количество всех записей для пагинации
      const totalRows = this.totalRows;
      return res.status(200).json({ results: data, totalRows: totalRows });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  };
}

const leadsController = new LeadsController();
export default leadsController;
