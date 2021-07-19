const Sequelize = require("sequelize");

class Entrega extends Sequelize.Model {
    static init(sequelize) {
        super.init({
            descricao: Sequelize.STRING,
            status: Sequelize.STRING,
            valor: Sequelize.DECIMAL,
        },
        {
            sequelize
        });
    }

    static associate(models) {
        this.belongsTo(models.Cliente, { foreignKey: "clienteId", onDelete: "cascade" });
        this.belongsTo(models.Motoboy, { foreignKey: "motoboyId", onDelete: "cascade" });
    }
}

module.exports = Entrega;