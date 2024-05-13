import { Model, DataTypes, Sequelize } from "sequelize";

export interface BookAttributes {
  id: Number,
  exercise1: Object,
  exercise1answer: Object,
  exercise2: Object,
  exercise2answer: Object,
  exercise3: Object,
  exercise3answer: Object,
  exercise4: Object,
  exercise4answer: Object

}

class BookOne extends Model implements BookAttributes {
  declare id: Number;
  declare exercise1: Object;
  declare exercise1answer: Object;
  declare exercise2: Object;
  declare exercise2answer: Object;
  declare exercise3: Object;
  declare exercise3answer: Object;
  declare exercise4: Object;
  declare exercise4answer: Object;

  static initialize(sequelize: Sequelize): void {
    this.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      exercise1: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise1answer: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise2: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise2answer: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise3: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise3answer: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise4: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      exercise4answer: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    }, {
        sequelize,
        modelName: 'BookOne',
        tableName: 'book_one',
        underscored: true
      });
  }
}

export default BookOne;
