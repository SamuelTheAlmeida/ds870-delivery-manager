const Sequelize = require("sequelize");

class Cliente extends Sequelize.Model {
    static init(sequelize) {
        super.init({
            nomeEmpresa: Sequelize.STRING,
            CNPJ: Sequelize.STRING,
            endereco: Sequelize.STRING
        },
        {
            sequelize
        });
    }

    static associate(models) {
        this.hasMany(models.Entrega, { foreignKey: "clienteId" });
    }
}

module.exports = Cliente;