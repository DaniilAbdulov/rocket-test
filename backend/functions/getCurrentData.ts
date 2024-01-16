import { Lead, Status, User, Contact, CustomFieldsContact } from "../models";
import { formatDate } from "./formatDate";
interface Data {
    id: number;
    name: string;
    price: number;
    status_name: string;
    status_color: string;
    user: string;
    created_at: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
}

export function getCurrentData(
    leads: Lead[],
    statuses: Status[],
    users: User[],
    contacts: Contact[]
): Data[] {
    // Предварительно создаем кэш для статусов и пользователей
    const statusMap = new Map(statuses.map((s) => [s.id, s]));
    const userMap = new Map(users.map((u) => [u.id, u]));
    const contactMap = new Map(contacts.map((c) => [c.id, c]));

    return leads.map((lead) => {
        //получаем вложенный объект с id привязанного контака и тут же получаем поля из
        //соответсвующего объекта в contactMap
        const { contacts: leadContacts } = lead._embedded;
        const contactData = leadContacts.length
            ? contactMap.get(leadContacts[0].id)
            : null;
        //устанавливаем поля name,phone,email
        let contact_name = contactData?.name ?? "";
        let contact_phone = "";
        let contact_email = "";
        //если у объекта contactData есть ключ custom_fields_values
        //пытаемся получить значения телефона и почты с помощью функции getField()
        if (contactData?.custom_fields_values) {
            contact_phone = getField(contactData, "PHONE");
            contact_email = getField(contactData, "EMAIL");
        }
        //получаем поля объекта status по id статуса сделки
        const status = statusMap.get(lead.status_id);
        //получаем поля объекта user по id ответсвенного за сделку пользователя
        const user = userMap.get(lead.responsible_user_id);
        //возвращаем объект для отрисовки в таблице
        return {
            id: lead.id,
            name: lead.name,
            price: lead.price,
            status_name: status?.name,
            status_color: status?.color,
            user: user?.name,
            created_at: formatDate(lead.created_at),
            contact_name,
            contact_phone,
            contact_email,
        };
    });
}

function getField(contactData: Contact, fieldCode: string): string {
    const field = contactData.custom_fields_values.find(
        (v: CustomFieldsContact) => v.field_code === fieldCode
    );
    return field?.values[0].value ?? "";
}
