
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserExerciseAttributes {
  userId: number;
  exerciseId: number;
  status?: string;
  progress?: number;
}

class UserExercise extends Model implements UserExerciseAttributes {
  declare userId: number;
  declare exerciseId: number;
  declare status: string;
  declare progress: number;

  static initialize(sequelize: Sequelize): void {
    this.init({
      userId: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'userId' }
      },
      exerciseId: {
        type: DataTypes.INTEGER,
        references: { model: 'Exercises', key: 'exerciseId' }
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
        sequelize,
        modelName: 'UserExercise',
        tableName: 'user_exercises',
        timestamps: false,
        underscored: true,
      });

  }
}


export default UserExercise;
