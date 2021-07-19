'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Clientes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nomeEmpresa: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      CNPJ: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      associadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Associados", key: "id" },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Clientes");
  }
};
