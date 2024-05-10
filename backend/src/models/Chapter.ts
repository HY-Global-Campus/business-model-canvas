
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface ChapterAttributes {
  chapterId: number;
  title: string;
  description?: string;
}

class Chapter extends Model implements ChapterAttributes {
  declare chapterId: number;
  declare title: string;
  declare description: string;

  static initialize(sequelize: Sequelize): void {
    this.init({
      chapterId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
        sequelize,
        modelName: 'Chapter',
        tableName: 'chapters',
        underscored: true,
      });
  }
}

export default Chapter;
