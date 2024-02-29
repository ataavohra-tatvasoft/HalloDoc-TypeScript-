import { DataTypes, Model } from 'sequelize';
import sequelize from '../../connections/database';
import Request from './request'; 

class Order extends Model {
  declare orderId: number; 
  declare requestId: number; 
  declare request_state: string;
  declare profession: string;
  declare businessName: string;
  declare businessContact: number;
  declare email: string;
  declare faxNumber: number;
  declare orderDetails: string;
  declare numberOfRefill: number;
}

Order.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Request",
        key: 'request_id',
      },
    },
    request_state:{
      type: DataTypes.ENUM("active", "conclude", "toclose"),
      allowNull: false,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessContact: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    faxNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orderDetails: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberOfRefill: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {  timestamps:false,
    sequelize,
    tableName: 'orders',
  }
);

export default Order;
