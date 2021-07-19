const Sequelize = require("sequelize");
const dbConfig = require("./config/dbconfig");

const Cliente = require("../models/Cliente");
const Motoboy = require("../models/Motoboy");
const Entrega = require("../models/Entrega");
const Associado = require("../models/Associado");

const connection = new Sequelize(dbConfig);

Cliente.init(connection);
Motoboy.init(connection);
Entrega.init(connection);
Associado.init(connection);

Entrega.associate(connection.models);
Cliente.associate(connection.models);
Associado.associate(connection.models);

module.exports = connection;