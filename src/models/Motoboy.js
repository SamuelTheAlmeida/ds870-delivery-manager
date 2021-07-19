const Sequelize = require("sequelize");

class Motoboy extends Sequelize.Model {
    static init(sequelize) {
        super.init({
            nome: Sequelize.STRING,
            CPF: Sequelize.STRING,
            senha: Sequelize.STRING,
            telefone: Sequelize.STRING
        },
        {
            sequelize
        });
    }

    static associate(models) {
        this.hasMany(models.Entrega, { foreignKey: "motoboyId", onDelete: "cascade" });
    }
}

module.exports = Motoboy;