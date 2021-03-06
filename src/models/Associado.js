const Sequelize = require("sequelize");

class Associado extends Sequelize.Model {
    static init(sequelize) {
        super.init({
            nomeEmpresa: Sequelize.STRING,
            CNPJ: Sequelize.STRING,
            senha: Sequelize.STRING,
            endereco: Sequelize.STRING
        },
        {
            sequelize
        });
    }

    static associate(models) {
        this.hasMany(models.Cliente, { foreignKey: "associadoId", onDelete: "cascade" });
    }
}

module.exports = Associado;