import Sequelize from 'sequelize';

/** @param {{ context: import('sequelize').QueryInterface }} params */
export async function up({ context: queryInterface }) {
  await queryInterface.addColumn('users', 'password_reset_token', {
    type: Sequelize.JSONB,
    allowNull: true,
  });
}

/** @param {{ context: import('sequelize').QueryInterface }} params */
export async function down({ context: queryInterface }) {
  await queryInterface.removeColumn('users', 'password_reset_token');
}
