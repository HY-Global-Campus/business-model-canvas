import { Sequelize } from 'sequelize';
import config from '../config.js';

const sequelize = new Sequelize(config.DB_URL, {dialect: 'postgres'});

import Chapter from '../models/Chapter.js';
import User from '../models/user.js';
import Exercise from '../models/Exercise.js';
import UserExercise from '../models/UserExercise.js';

Chapter.initialize(sequelize);
User.initialize(sequelize);
Exercise.initialize(sequelize);
UserExercise.initialize(sequelize);

// Setup associations
Chapter.hasMany(Exercise, { foreignKey: 'chapter_id' });
Exercise.belongsTo(Chapter, { foreignKey: 'chapter_id' });

User.belongsToMany(Exercise, { through: UserExercise, foreignKey: 'user_id' });
Exercise.belongsToMany(User, { through: UserExercise, foreignKey: 'exercise_id' });

export const dbSync = async () => {
  try {
    await sequelize.sync({ force: true }); // Use force: false to avoid dropping tables
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
};

export default sequelize;
