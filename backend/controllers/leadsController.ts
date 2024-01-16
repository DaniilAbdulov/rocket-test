import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { getCurrentData } from "../functions/getCurrentData";
dotenv.config();

class LeadsController {
  //начальное число сделок устанавливаем на ноль
  totalRows: number = 0;
  //функция getResponseBody помогает избежать повторения кода. Принимает только URL, токен и параметры для запроса
  private async getResponseBody(url: string, token: string, params?: any) {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      //если отправляется запрос на получение сделок, то необходимо установить их ообщее кол-во для пагинации
      if (url.endsWith("/api/v4/leads")) {
        // Получение заголовка X-Total-Count
        const totalCountHeader = response.headers["x-total-count"];
        if (totalCountHeader) {
          console.log(`X-Total-Count: ${totalCountHeader}`);
        } else {
          console.log("X-Total-Count header is missing");
        }
        /*API amoCRM не предоставляет информации об общем количесвте сделок. Ссылка на
        ответ по этому поводу от Nikita bessudnov CTO (Past: Senior PHP, Teamlead and DevOps) at amoCRM
        https://github.com/amocrm/amocrm-api-php/issues/209#issuecomment-759375512
        */
        if (!this.totalRows) {
          this.totalRows =
            parseInt(totalCountHeader, 10) ||
            response.request.socket._eventsCount;
        }
      }
      //возвращаем полученные данные начиная с объекта ._embedded
      return response.data._embedded;
    } catch (error) {
      console.error("Error making API request", error);
      throw new Error("Ошибка сервера при выполнении запроса к API.");
    }
  }

  public getData = async (req: Request, res: Response) => {
    try {
      //базовый URL для всех дальнейших запросов
      const API_BASE_URL = `https://${process.env.SUBDOMAIN}.amocrm.ru`;

      //получаем токен для запросов
      const token = global.access_token;
      if (!token) {
        return res.status(422).json({ message: "Некорректный токен" });
      }

      //получаем список сделок с определенными параметрами
      //данные для запроса с определенными условиями
      const page = parseInt(req.query._page);
      const limit = parseInt(req.query._limit);
      const query = req.query.q;
      if (typeof page !== "number" || typeof limit !== "number") {
        return res
          .status(422)
          .json({ message: "Некорректные данные пагинации" });
      }
      const leadsUrl = API_BASE_URL + "/api/v4/leads";
      const { leads } = await this.getResponseBody(leadsUrl, token, {
        with: "contacts",
        page,
        limit,
        query,
      });

      // возвращаем пустые массивы, если таковые получили
      if (!leads || leads.length === 0) {
        return res.status(200).json({ results: [], totalRows: 0 });
      }

      //получем id воронки со сделками
      const pipelineId: number = leads[0].pipeline_id;
      if (!pipelineId || typeof pipelineId !== "number") {
        return res.status(422).json({ message: "Некорректный id воронки" });
      }

      //получаем список статусов сделок нашей воронки
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
      //отправляем отформатированный объект с данными и кол-во всех записей на клиента
      return res.status(200).json({ results: data, totalRows: totalRows });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

const leadsController = new LeadsController();
export default leadsController;
