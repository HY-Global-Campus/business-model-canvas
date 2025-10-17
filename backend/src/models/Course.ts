import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { CourseExercises, BMCExercises, BusinessContext } from '../types/exercises';

export interface CourseAttributes {
  id: number;
  exercises: CourseExercises;
  mindmap: object | null;
  userId: string;
  displayName: string;
  reflection: string | null;
  // BMC fields
  canvasData: BMCExercises;
  businessContext: BusinessContext;
  lastModified: Record<string, string>;
  completionStatus: Record<string, number>;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare id: number;
  declare exercises: CourseExercises;
  declare mindmap: object | null;
  declare userId: string;
  declare displayName: string;
  declare reflection: string | null;
  // BMC fields
  declare canvasData: BMCExercises;
  declare businessContext: BusinessContext;
  declare lastModified: Record<string, string>;
  declare completionStatus: Record<string, number>;

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
        canvasData: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        businessContext: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: { industry: '', stage: '', description: '' },
        },
        lastModified: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        completionStatus: {
          type: DataTypes.JSONB,
          allowNull: false,
          defaultValue: {},
        },
      },
      {
        sequelize,
        modelName: 'Course',
        tableName: 'course',
        underscored: true,
      }
    );
  }
}

export default Course;


