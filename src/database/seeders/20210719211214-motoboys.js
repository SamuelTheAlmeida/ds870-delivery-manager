'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = "$2a$12$54wGaHTAH/mK1SMXECz./.WHkiNU/Y3zPeSZ1KQAu1apnG8RAJPoe"; //@test123

    return queryInterface.bulkInsert(
      "Motoboys",
      [
        {
          nome: "Joana da Silva",
          CPF: "joana@yahoo.com",
          senha: hash,
          telefone: "41999999999"
        },
        {
          nome: "Frederico Nunes",
          CPF: "fred@ig.com.br",
          senha: hash,
          telefone: "41998893400"
        },
        {
          nome: "Mário da Silva",
          CPF: "msilva@gmail.com",
          senha: hash,
          telefone: "41987902330"
        },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Motoboys", null, {});
  }
};
