'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Clientes",
      [
        {
          nomeEmpresa: "Catatau Lanches",
          CNPJ: "44160060000147",
          associadoId: 1,
        },
        {
          nomeEmpresa: "Coca Cola SA",
          CNPJ: "12520788000146",
          associadoId: 2,
        },
        {
          nomeEmpresa: "Banco do Brasil",
          CNPJ: "85085941000128",
          associadoId: 1
        },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Clientes", null, {});
  }
};
