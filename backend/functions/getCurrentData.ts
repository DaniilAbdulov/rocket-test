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
  leads: any[],
  statuses: any[],
  users: any[],
  contacts: any[]
): Data[] {
  const res = leads.map((l: any) => {
    const contactDataIsAvailable = l._embedded.contacts.length ? true : false;
    let contact_name = "";
    let contact_phone = "";
    let contact_email = "";
    if (contactDataIsAvailable) {
      const contactData = contacts.find(
        (c) => c.id === l._embedded.contacts[0].id
      );
      contact_name = contactData.name ? contactData.name : "";

      if (contactData.custom_fields_values) {
        const contactPhoneField = contactData.custom_fields_values.find(
          (v: any) => v.field_code === "PHONE"
        );
        if (contactPhoneField) {
          contact_phone = contactPhoneField.values[0].value;
        }
        const contactEmailField = contactData.custom_fields_values.find(
          (v: any) => v.field_code === "EMAIL"
        );
        if (contactEmailField) {
          contact_email = contactEmailField.values[0].value;
        }
      }
    }

    return {
      id: l.id,
      name: l.name,
      price: l.price,
      status_name: statuses.find((s: any) => s.id === l.status_id)?.name,
      status_color: statuses.find((s: any) => s.id === l.status_id)?.color,
      user: users.find((u: any) => u.id === l.responsible_user_id)?.name,
      created_at: formatData(l.created_at),
      contact_name,
      contact_phone,
      contact_email,
    };
  });
  return res;
}
function formatData(t: number) {
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
