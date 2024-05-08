import { Model, DataTypes, Sequelize } from "sequelize";

export interface ExerciseAttributes {
  exercise_id: number;
  chapter_id: number;
  type: string;
  content: any;
}

class Exercise extends Model implements ExerciseAttributes {
  declare exercise_id: number;
  declare chapter_id: number;
  declare type: string;
  declare content: any;

  static initialize(sequelize: Sequelize): void {
    this.init({
      exercise_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'chapters', key: 'chapter_id' }
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
        modelName: 'Exercise'
      });

  }
}

export default Exercise;
