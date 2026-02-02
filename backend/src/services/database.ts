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
    // Use migrations for production, sync for development
    if (process.env.NODE_ENV === 'production') {
      // Run migrations for production
      const { Umzug, SequelizeStorage } = await import('umzug');
      const umzug = new Umzug({
        migrations: { glob: 'migrations/*.js' },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
      });
      
      await umzug.up();
      console.log('Database migrations completed successfully');
    } else {
      // Use sync for development (convenience)
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully (development mode)');
    }
  } catch (error) {
    console.error("Failed to synchronize database:", error);
    throw error; // Re-throw to fail fast in production
  }
};

export default sequelize;
