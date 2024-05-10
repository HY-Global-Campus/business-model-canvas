import { Model, DataTypes, Sequelize } from "sequelize";

export interface ExerciseAttributes {
  exerciseId: number;
  chapterId: number;
  type: string;
  content: any;
}

class Exercise extends Model implements ExerciseAttributes {
  declare exerciseId: number;
  declare chapterId: number;
  declare type: string;
  declare content: any;

  static initialize(sequelize: Sequelize): void {
    this.init({
      exerciseId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chapterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chapters', key: 'chapterId' }
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.JSONB,
        allowNull: false
      }
    }, {
        sequelize,
        modelName: 'Exercise',
        tableName: 'exercises',
        underscored: true,
      });

  }
}

export default Exercise;
