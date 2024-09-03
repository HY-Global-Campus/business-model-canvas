
import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { BookOneExercises } from '../types/exercises';

export interface BookOneAttributes {
  id: number;
  exercises: BookOneExercises;
  mindmap: object;
  userId: string;
  displayName: string;
  reflection: string;
}

// Define a type for creating a new BookOne entry, making id optional
export interface BookOneCreationAttributes extends Optional<BookOneAttributes, 'id'> {}

class BookOne extends Model<BookOneAttributes, BookOneCreationAttributes> implements BookOneAttributes {
  declare id: number;
  declare exercises: BookOneExercises;
  declare mindmap: object;
  declare userId: string;
  declare displayName: string;
  declare reflection: string;

  static initialize(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        exercises: {
          type: DataTypes.JSONB,
          allowNull: false,
        },
        mindmap: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: "",
        },
        reflection: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'BookOne',
        tableName: 'book_one',
        underscored: true,
      }
    );
  }
}

export default BookOne;


