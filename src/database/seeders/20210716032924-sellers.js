'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = "$2y$12$EAzrsVgO9vJUZ8ShvGgjReeHaLlInfaeKbodjoqavJBeTr3I8Y1ZG";

    return queryInterface.bulkInsert(
      "Sellers",
      [
        {
          name: "José de Oliveira",
          email: "j_oliveira@gmail.com",
          password: hash
        },
        {
          name: "Marcia Carla",
          email: "mcarla@gmail.com",
          password: hash
        },
        {
          name: "Felipe Candido",
          email: "felipe@gmail.com",
          password: hash
        },
      ]
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Sellers", null, {});
  }
};
