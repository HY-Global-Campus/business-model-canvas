
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserExerciseAttributes {
  user_id: number;
  exercise_id: number;
  status?: string;
  progress?: number;
}

class UserExercise extends Model implements UserExerciseAttributes {
  declare user_id: number;
  declare exercise_id: number;
  declare status: string;
  declare progress: number;

  static initialize(sequelize: Sequelize): void {
    this.init({
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'user_id' }
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        references: { model: 'exercises', key: 'exercise_id' }
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
        timestamps: false
      });

  }
}


export default UserExercise;
