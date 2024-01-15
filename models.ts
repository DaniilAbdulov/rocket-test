export interface User {
  id: number;
  name: string;
  email: string;
  lang: string;
  rights: any[];
  _links: {
    self: {
      href: string;
    };
  };
}

const user: User = {
  id: 123123,
  name: 'Пользователь для примера 2',
  email: 'example2@mail.com',
  lang: 'en',
  rights: {
    leads: { view: 'A', edit: 'A', add: 'A', delete: 'A', export: 'A' },
    contacts: { view: 'A', edit: 'A', add: 'A', delete: 'A', export: 'A' },
    companies: { view: 'A', edit: 'A', add: 'A', delete: 'A', export: 'A' },
    tasks: { edit: 'A', delete: 'A' },
    mail_access: false,
    catalog_access: false,
    files_access: false,
    status_rights: [
      {
        entity_type: 'leads',
        pipeline_id: 2194576,
        status_id: 30846277,
        rights: { view: 'A', edit: 'A', delete: 'A' },
      },
      {
        entity_type: 'leads',
        pipeline_id: 2212201,
        status_id: 30965377,
        rights: { view: 'A', edit: 'A', delete: 'A' },
      },
    ],
    is_admin: false,
    is_free: false,
    is_active: true,
    group_id: null,
    role_id: null,
  },
  _links: { self: { href: 'https://example.amocrm.ru/api/v4/users/123123/' } },
};
const user2: User = {
  id: 10522450,
  name: 'Даниил',
  email: 'danmaster09@yandex.ru',
  lang: 'ru',
  rights: {
    leads: [Object],
    contacts: [Object],
    companies: [Object],
    tasks: [Object],
    mail_access: true,
    catalog_access: true,
    files_access: true,
    status_rights: [Array],
    catalog_rights: null,
    custom_fields_rights: null,
    oper_day_reports_view_access: false,
    oper_day_user_tracking: false,
    is_admin: true,
    is_free: false,
    is_active: true,
    group_id: null,
    role_id: null,
  },
  _links: { self: [Object] },
};
//============================================
export interface Contact {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  responsible_user_id: number;
  group_id: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closest_task_at: null | number;
  is_deleted: boolean;
  is_unsorted: boolean;
  custom_fields_values: null | CustomFieldsContact;
  account_id: number;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: ContactEmbedded;
}

export interface ContactEmbedded {
  tags: ContactEmbeddedValues[];
  leads: ContactEmbeddedValues[];
  customers: ContactEmbeddedValues[];
  catalog_elements: ContactEmbeddedValues[];
  companies: ContactEmbeddedValues[];
}

export interface ContactEmbeddedValues {
  id: number;
  _links: {
    self: {
      href: string;
    };
  };
}

export interface CustomFieldsContact {
  field_id: number;
  field_name: string;
  field_code: string;
  field_type: string;
  values: CustomFieldsContactValues[];
}

export interface CustomFieldsContactValues {
  value: string;
  enum_id: number;
  enum: string;
}

const contact: Contact = {
  id: 7143599,
  name: '1',
  first_name: '',
  last_name: '',
  responsible_user_id: 504141,
  group_id: 0,
  created_by: 504141,
  updated_by: 504141,
  created_at: 1585758065,
  updated_at: 1585758065,
  closest_task_at: null,
  custom_fields_values: null,
  account_id: 28805383,
  _links: {
    self: {
      href: 'https://example.amocrm.ru/api/v4/contacts/7143599',
    },
  },
  _embedded: {
    tags: [],
    companies: [],
  },
};
// const contact:Contact = {
//   id: 1179465,
//   name: 'Алексей Иванович',
//   first_name: 'Алексей',
//   last_name: 'Иванович',
//   responsible_user_id: 10522450,
//   group_id: 0,
//   created_by: 10522450,
//   updated_by: 10522450,
//   created_at: 1705121615,
//   updated_at: 1705121755,
//   closest_task_at: null,
//   is_deleted: false,
//   is_unsorted: false,
//   custom_fields_values: null,
//   account_id: 31494866,
//   _links: { self: [Object] },
//   _embedded: { tags: [], catalog_elements: [], companies: [Array] },
// };
/===========================================
export interface Status {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  pipeline_id: number;
  color: string;
  type: number;
  is_default: boolean;
  account_id: number;
  _links: {
    self: {
      href: string;
    };
  };
  conditions: any[];
}

const arr: Status[] = [
  {
    id: 4740010,
    name: 'Recently purchased',
    sort: 0,
    is_editable: true,
    pipeline_id: 0,
    color: '#ccff66',
    type: 4,
    is_default: true,
    account_id: 28805383,
    _links: {
      self: {
        href: 'https://example.amocrm.ru/api/v4/customers/statuses/4740010',
      },
    },
    conditions: [],
  },
  {
    id: 47400102,
    name: 'Recently purchased',
    sort: 0,
    is_editable: true,
    pipeline_id: 0,
    color: '#ccff66',
    type: 4,
    is_default: true,
    account_id: 28805383,
    _links: {
      self: {
        href: 'https://example.amocrm.ru/api/v4/customers/statuses/4740010',
      },
    },
    conditions: [],
  },
];
//==============================
const arr: Lead[] = [
  {
    id: 19619,
    name: 'Сделка для примера',
    price: 46333,
    responsible_user_id: 123321,
    group_id: 625,
    status_id: 142,
    pipeline_id: 1300,
    loss_reason_id: null,
    source_id: null,
    created_by: 321123,
    updated_by: 321123,
    created_at: 1453279607,
    updated_at: 1502193501,
    closed_at: 1483005931,
    closest_task_at: null,
    is_deleted: false,
    custom_fields_values: null,
    score: null,
    account_id: 5135160,
    _links: {
      self: {
        href: 'https://example.amocrm.ru/api/v4/leads/19619',
      },
    },
    _embedded: {
      tags: [],
      companies: [],
    },
  },
  {
    id: 553809,
    name: 'Покупка бензина',
    price: 10000,
    responsible_user_id: 10529282,
    group_id: 0,
    status_id: 63269026,
    pipeline_id: 7653418,
    loss_reason_id: null,
    created_by: 10522450,
    updated_by: 10522450,
    created_at: 1705121754,
    updated_at: 1705121782,
    closed_at: null,
    closest_task_at: null,
    is_deleted: false,
    custom_fields_values: null,
    score: null,
    account_id: 31494866,
    labor_cost: null,
    _links: { self: { href: 'fdsfdsf' } },
    _embedded: {
      tags: [],
      companies: [
        {
          id: 10971463,
          _links: {
            self: {
              href: 'https://example.amocrm.ru/api/v4/companies/10971463',
            },
          },
        },
      ],
      contacts: [
        {
          id: 10971465,
          is_main: true,
          _links: {
            self: {
              href: 'https://example.amocrm.ru/api/v4/contacts/10971465',
            },
          },
        },
      ],
    },
  },
];

export interface LeadsContact {
  id: number;
  is_main: boolean;
  _links: {
    self: {
      href: string;
    };
  };
}

export interface Lead {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  group_id: number;
  status_id: number;
  pipeline_id: number;
  loss_reason_id: number | null;
  source_id: number | null;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closed_at: number | null;
  closest_task_at: number | null;
  is_deleted: boolean;
  custom_fields_values: any | null;
  score: number | null;
  account_id: number;
  labor_cost: number | null;
  _links: {
    self: {
      href: string;
    };
  };
  _embedded: {
    tags: any[];
    companies: any[];
    contacts: LeadsContact[];
  };
}
