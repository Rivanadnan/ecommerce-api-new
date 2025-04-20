import { RowDataPacket } from "mysql2";

export interface IOrderItem extends RowDataPacket {
  id?: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}
