'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('course', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      exercises: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      mindmap: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      display_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      reflection: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      canvas_data: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      business_context: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: { industry: '', stage: '', description: '' }
      },
      last_modified: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      completion_status: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('course');
  }
};
