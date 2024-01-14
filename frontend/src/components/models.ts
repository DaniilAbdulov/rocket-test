export interface Column {
  name: string;
  label: string;
  field: string;
  align: string;
}

export interface Pagination {
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}

export interface RequestProps {
  pagination: Pagination;
  filter: string;
}
export interface Rows {
  contact_email: string;
  contact_name: string;
  contact_phone: string;
  created_at: string;
  id: number;
  name: string;
  price: number;
  status_color: string;
  status_name: string;
  user: string;
}
