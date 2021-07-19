'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Entregas",
      [
        {
          descricao: "Roupas",
          clienteId: 1,
          motoboyId: 1,
          status: "Pendente",
        },
        {
          descricao: "X-Calabresa e 2 cocas lata",
          clienteId: 1,
          motoboyId: 2,
          status: "Pendente",
        },
        {
          descricao: "Peças automotivas",
          clienteId: 3,
          motoboyId: 1,
          status: "Pendente"
        },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Entregas", null, {});
  }
};
