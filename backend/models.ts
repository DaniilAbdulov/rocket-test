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
//==============================
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
