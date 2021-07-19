'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = "$2a$12$54wGaHTAH/mK1SMXECz./.WHkiNU/Y3zPeSZ1KQAu1apnG8RAJPoe"; //@test123

    return queryInterface.bulkInsert(
      "Associados",
      [
        {
          nomeEmpresa: "Empresa Teste LTDA",
          CNPJ: "teste_ltda@gmail.com",
          senha: hash
        },
        {
          nomeEmpresa: "João da Silva ME",
          CNPJ: "j.silva@hotmail.com",
          senha: hash
        },
        {
          nomeEmpresa: "Neymar",
          CNPJ: "neymar@neymar.com",
          senha: hash
        },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Associados", null, {});
  }
};
