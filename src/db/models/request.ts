import {
  Table,
  Column,
  DataType,
  Model,
  HasMany,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import Documents from "./documents";
import Order from "./order";
import Notes from "./notes";
import User from "./user";
import Requestor from "./requestor";
import {
  RequestCreationAttributes,
  RequestAttributes,
} from "../../interfaces/request_model";

@Table({
  timestamps: true,
  tableName: "request",
})
export default class Request extends Model<
  RequestAttributes,
  RequestCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  request_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  confirmation_no: string;

  @Column({
    type: DataType.ENUM(
      "new",
      "active",
      "pending",
      "conclude",
      "toclose",
      "unpaid"
    ),
    allowNull: false,
  })
  request_state: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  patient_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  physician_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  provider_id: number;

  @Column({
    type: DataType.ENUM(
      "family/friend",
      "concierge",
      "business",
      "vip",
      "admin",
      "patient",
      "provider"
    ),
    allowNull: false,
  })
  requested_by: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  requestor_id: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  requested_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  concluded_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  date_of_service: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  closed_date: Date;

  @Column({
    type: DataType.ENUM(
      "new",
      "accepted",
      "closed",
      "conclude",
      "blocked",
      "clear",
      "cancelled by admin",
      "cancelled by provider"
    ),
    defaultValue: "new",
    allowNull: false,
  })
  request_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  block_reason: string;

  @Column({
    type: DataType.ENUM("pending", "accepted", "rejected"),
    defaultValue: null,
    allowNull: true,
  })
  transfer_request_status: string;

  @Column({
    type: DataType.ENUM("pending", "accepted", "rejected"),
    defaultValue: null,
    allowNull: true,
  })
  agreement_status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  notes_symptoms: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  assign_req_description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  final_report: string;

  @BelongsTo(() => User, {
    as: "Provider",
    foreignKey: "provider_id",
    targetKey: "user_id",
  })
  Provider: User;

  @BelongsTo(() => User, {
    as: "Physician",
    foreignKey: "physician_id",
    targetKey: "user_id",
  })
  Physician: User;

  @BelongsTo(() => User, {
    as: "Patient",
    foreignKey: "patient_id",
    targetKey: "user_id",
  })
  Patient: User;

  @BelongsTo(() => Requestor, {
    foreignKey: "requestor_id",
    targetKey: "user_id",
  })
  Requestor: Requestor;

  @HasMany(() => Notes, { foreignKey: "request_id" })
  Notes: Notes[];

  @HasOne(() => Order, { foreignKey: "request_id" })
  Order: Order[];

  @HasMany(() => Documents, { as: "Documents", foreignKey: "request_id" })
  Documents: Documents[];
  // @HasMany(() => User)
  // Patient: User[];

  // @HasMany(() => Requestor)
  // Requestors: Requestor[];
}