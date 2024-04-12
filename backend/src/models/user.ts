
import { Model, DataTypes } from "sequelize";

import sequelize from "../services/database.js"; 


interface IUser {
  id: string,
  displayName: string,
  accelbyteUserId: string
}

class User extends Model implements IUser {
  declare id!: string;
  declare displayName!: string;
  declare accelbyteUserId!: string;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accelbyteUserId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
    sequelize,
    modelName: 'User',
    underscored: true,
  });
User.sync();

export default User;
