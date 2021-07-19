const Associado = require("../models/Associado");
const Cliente = require("../models/Cliente");
const Motoboy = require("../models/Motoboy");
const Entrega = require("../models/Entrega");

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function validarPerfil(req, perfil, res) {
    if (req.perfil !== perfil || !req.id)
        return res.status(403).json({ msg: "Acesso não permitido." });
}


module.exports = {
    async administrativoAssociados(req, res) {
        validarPerfil(req, "associado", res);

        const associadoId = req.id;
        const Op = Sequelize.Op;

        const totalEntregas = await Entrega.findAndCountAll({
            include: {
              model: Cliente,
              where: {
                associadoId: {
                  [Op.eq]: associadoId
                }
              }
            }
        });

        const top5Clientes = await Entrega.findAll({
            group: ['Cliente.id'],
            include: {
              model: Cliente,
              attributes: ['id', 'nomeEmpresa'],
              where: {
                associadoId: {
                  [Op.eq]: associadoId
                }
              }
            },
            attributes: [[Sequelize.fn('COUNT', 'Cliente.id'), 'Entregas']],
            limit: 5
        });

        const top5Motoboys = await Entrega.findAll({
            group: ['motoboyId'],
            include: [
            {
                model: Cliente,
                attributes: [],
                where: {
                    associadoId: {
                        [Op.eq]: associadoId
                    }
                }
            },
            {
                model: Motoboy,
                attributes: ["id", "nome"]
            },
            ],
            attributes: [[Sequelize.fn('COUNT', 'motoboyId'), 'Entregas']],
            limit: 5
        });

        const entregasPendentes = await Entrega.findAndCountAll({
            include: {
              model: Cliente,
              where: {
                associadoId: {
                  [Op.eq]: associadoId
                }
              }
            },
            where: {
                status: "Pendente"
              }
        });

        const entregasRealizadas = await Entrega.findAndCountAll({
            include: {
              model: Cliente,
              where: {
                associadoId: {
                  [Op.eq]: associadoId
                }
              }
            },
            where: {
                status: "Realizada"
              }
        });

        const porcentagemEntregasPendentes = 
            ((entregasPendentes.count)
            /(entregasPendentes.count + entregasRealizadas.count))
            *100;

        const porcentagemEntregasRealizadas = 
            ((entregasRealizadas.count)
            /(entregasPendentes.count + entregasRealizadas.count))
            *100;
        

        const result = {
            totalClientes: (await Cliente.findAndCountAll({
                where: { associadoId }
            })).count,
            totalMotoboys: (await Motoboy.findAndCountAll()).count,
            totalEntregas: totalEntregas.count,
            top5Clientes,
            top5Motoboys,
            porcentagemEntregasPendentes,
            porcentagemEntregasRealizadas
        }

        return res.status(200).json(result);
    },

    async financeiro(req, res) {
        validarPerfil(req, "associado", res);

        const associadoId = req.id;
        const Op = Sequelize.Op;

        const entregasRealizadas = await Entrega.findAll({
            include: {
              model: Cliente,
              attributes: [],
              where: {
                associadoId: {
                  [Op.eq]: associadoId
                }
              }
            },
            where: {
                status: "Realizada"
            },
            attributes: [
                'Cliente.associadoId',
                [Sequelize.fn('sum', Sequelize.col('valor')), 'valor'],
            ],
            group: ['Cliente.associadoId'],
        });
        const valorTotal = JSON.parse(JSON.stringify(entregasRealizadas[0])).valor;
        return res.status(200).json({
            valorTotalEntregas: Number(valorTotal),
            valorParaMotoboys: Number(valorTotal)*0.7,
            valorParaAssociado: Number(valorTotal)*0.3
        });
    },

    async financeiroMotoboys(req, res) {
        validarPerfil(req, "motoboy", res);

        const motoboyId = req.id;

        const entregasRealizadas = await Entrega.findAll({
            where: {
                status: "Realizada",
                motoboyId
            },
            attributes: [
                'motoboyId',
                [Sequelize.fn('sum', Sequelize.col('valor')), 'valor'],
            ],
            group: ['motoboyId'],
        });
        const valorTotal = JSON.parse(JSON.stringify(entregasRealizadas[0])).valor;
        return res.status(200).json({
            valorTotalEntregas: Number(valorTotal),
            valorParaMotoboys: Number(valorTotal)*0.7,
            valorParaAssociado: Number(valorTotal)*0.3
        });
    }
}