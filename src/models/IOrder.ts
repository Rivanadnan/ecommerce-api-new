import { RowDataPacket } from "mysql2";
import { IOrderItem } from "./IOrderItem";

export interface IOrder extends RowDataPacket {
  id?: number;
  customer_id: number;
  total_price?: number;
  payment_status: string;
  payment_id: string;
  order_status: string;
  created_at?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  phone?: string;
  street_address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  customers_created_at?: string;
  orders_created_at?: string;
  product_id?: number;
  product_name?: string;
  quantity?: number;
  unit_price?: number;
  order_items?: IOrderItem[];
}
