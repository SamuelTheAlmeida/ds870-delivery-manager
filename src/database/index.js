const Sequelize = require("sequelize");
const dbConfig = require("./config/dbconfig");

const Seller = require("../models/Seller");
const Sale = require("../models/Sale");

const Cliente = require("../models/Cliente");
const Motoboy = require("../models/Motoboy");
const Entrega = require("../models/Entrega");
const Associado = require("../models/Associado");

const connection = new Sequelize(dbConfig);

Seller.init(connection);
Sale.init(connection);

Cliente.init(connection);
Motoboy.init(connection);
Entrega.init(connection);
Associado.init(connection);

Seller.associate(connection.models);
Sale.associate(connection.models);
Entrega.associate(connection.models);

module.exports = connection;