import { Sequelize } from 'sequelize';
import config from '../config.js';

const sequelize = new Sequelize(config.DB_URL, {dialect: 'postgres'});

import User from '../models/user.js';
import BookOne from '../models/BookOne.js';
import Course from '../models/Course.js';

User.initialize(sequelize);
BookOne.initialize(sequelize);
Course.initialize(sequelize);

// Setup associations

User.hasOne(BookOne, { foreignKey: 'userId' });
BookOne.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Course, { foreignKey: 'userId' });
Course.belongsTo(User, { foreignKey: 'userId' });

export const dbSync = async () => {
  try {
    // TEMPORARY: force: true to drop and recreate tables with new schema
    // TODO: Change back to force: false after first deployment, or use migrations
    const shouldForceSync = process.env.FORCE_DB_SYNC === 'true';
    await sequelize.sync({ force: shouldForceSync });
    console.log(`Database synchronized successfully (force: ${shouldForceSync})`);
  } catch (error) {
    console.error("Failed to synchronize database:", error);
  }
};

export default sequelize;
