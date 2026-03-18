
import { Model, DataTypes, Sequelize, Association } from 'sequelize';
import BookOne from './BookOne.js';

interface UserAttributes {
  id?: string;
  email: string;
  passwordHash?: string;
  displayName: string;
  oauthProvider?: string | null;
  oauthId?: string | null;
  isAdmin?: boolean;
  passwordResetToken?: {
    token: string;
    expiresAt: Date;
  } | null;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare displayName: string;
  declare oauthProvider: string | null;
  declare oauthId: string | null;
  declare isAdmin: boolean;
  declare passwordResetToken: {
    token: string;
    expiresAt: Date;
  } | null;

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
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        passwordHash: {
          type: DataTypes.STRING,
          allowNull: true, // Nullable for OAuth users
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        oauthProvider: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        oauthId: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        passwordResetToken: {
          type: DataTypes.JSONB,
          allowNull: true,
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

