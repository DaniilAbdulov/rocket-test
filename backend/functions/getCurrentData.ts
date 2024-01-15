import { Lead, Status, User, Contact, CustomFieldsContact } from "../models";
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
    const { contacts: leadContacts } = lead._embedded;
    const contactData = leadContacts.length
      ? contactMap.get(leadContacts[0].id)
      : null;

    let contact_name = contactData?.name ?? "";
    let contact_phone = "";
    let contact_email = "";

    if (contactData?.custom_fields_values) {
      contact_phone = getField(contactData, "PHONE");
      contact_email = getField(contactData, "EMAIL");
    }

    const status = statusMap.get(lead.status_id);
    const user = userMap.get(lead.responsible_user_id);

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

function formatDate(t: number): string {
  const date = new Date(t * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleDateString("ru-RU", options);
}
