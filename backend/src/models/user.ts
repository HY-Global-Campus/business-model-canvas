
import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import BookOne from './BookOne';

interface UserAttributes {
  id: string;
  displayName: string;
  accelbyteUserId: string;
  isAdmin: boolean;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare displayName: string;
  declare accelbyteUserId: string;
  declare isAdmin: boolean;

  declare static associations: {
    BookOne: Association<User, BookOne>;
  };

  declare BookOne?: BookOne;

  static initialize(sequelize: Sequelize): void {
    this.init(
      {
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
        isAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
      }
    );
  }
}

export default User;

