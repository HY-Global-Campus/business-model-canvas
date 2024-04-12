import { Sequelize } from 'sequelize';
import config from '../config.js';

const sequelize = new Sequelize(config.DB_URL, {dialect: 'postgres'});

export default sequelize;
