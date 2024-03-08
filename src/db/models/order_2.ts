import { Table, Column, DataType, Model,BelongsTo } from "sequelize-typescript";
import {
  OrderAttributes,
  OrderCreationAttributes,
} from "../../interfaces/order_model";
import Request from "./request_2";

@Table({ timestamps: true, tableName: "order" })
export default class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  orderId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  requestId: number;

  @BelongsTo(() => Request, {
    foreignKey: "requestId",
    targetKey: "request_id",
  })
  request?: Request; // Optional association for Request

  @Column({
    type: DataType.ENUM("active", "conclude", "toclose"),
    allowNull: false,
  })
  request_state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  profession: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  businessName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  businessContact: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  faxNumber: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderDetails: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  numberOfRefill: number;

  @BelongsTo(() => Request, {
    foreignKey: "requestId",
    targetKey: "request_id",
  })
  Request: Request;

  // Omitted createdAt and updatedAt for brevity (already defined by timestamps: true)
}