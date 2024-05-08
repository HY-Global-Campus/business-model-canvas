
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface ChapterAttributes {
  chapter_id: number;
  title: string;
  description?: string;
}

class Chapter extends Model implements ChapterAttributes {
  declare chapter_id: number;
  declare title: string;
  declare description: string;

  static initialize(sequelize: Sequelize): void {
    this.init({
      chapter_id: {
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
        modelName: 'Chapter'
      });
  }
}

export default Chapter;
