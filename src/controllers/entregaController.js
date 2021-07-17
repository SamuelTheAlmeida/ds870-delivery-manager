const Entrega = require("../models/Entrega");
const Cliente = require("../models/Cliente");
const Motoboy = require("../models/Motoboy");

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

function novaEntregaValidator(req, res) {
    const body = req.body;
    const schema = Joi.object().keys({
        descricao: Joi.string().required(),
        clienteId: Joi.number().required(),
        motoboyId: Joi.number().required(),
    });
    const { error, value } = schema.validate(body);
    if (error)
        return { 
            validator: false, 
            error: error.details 
        }
    else 
        return { 
            validator: true, 
            value 
        };
}

module.exports = {
    async novo(req, res) {
        const { descricao, clienteId, motoboyId } = req.body;
        const { validator, error } = novaEntregaValidator(req, res);
        if (!validator) {
            return res.status(422).json({
                msg: "dados inválidos",
                error: error[0].message
            })
        }

        const clienteExiste = await Cliente.findOne({
            where: { id: clienteId }
        });
        if (!clienteExiste)
            return res.status(400).json("cliente inválido");

        const motoboyExiste = await Motoboy.findOne({
            where: { id: motoboyId }
        });
        if (!motoboyExiste)
            return res.status(400).json("motoboy inválido");

        const entrega = await Entrega.create({
            descricao,
            clienteId,
            motoboyId,
            status: "Pendente"
        }).catch((error) => {
            return res.status(500).json({ msg: "não foi possivel inserir os dados" });
        });

        if (entrega)
            return res.status(201).json({ msg: "nova entrega foi adicionada" });
        else
            return res.status(404).json({ msg: "não foi possivel cadastrar nova entrega" });
    },

    async listarTodas(req, res) {
        const entregas = await Entrega.findAll({
            order: [["createdAt", "DESC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (entregas) res.status(200).json({ entregas });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar entregas "})
    },

    async listarRealizadas(req, res) {
        const entregas = await Entrega.findAll({
            where: { status: "Realizada" },
            order: [["createdAt", "DESC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (entregas) res.status(200).json({ entregas });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar entregas "})
    },

    async listarPendentes(req, res) {
        const entregas = await Entrega.findAll({
            where: { status: "Pendente" },
            order: [["createdAt", "DESC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (entregas) res.status(200).json({ entregas });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar entregas "})
    },

    async listarPorMotoboy(req, res) {
        const motoboyId = req.params.id;
        const entregas = await Entrega.findAll({
            where: { motoboyId },
            order: [["createdAt", "DESC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (entregas) res.status(200).json({ entregas });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar entregas "})
    },

    async atualizarPendente(req, res) {
		const entregaId = req.body.id;
		const entrega = req.body;
        const entregaExistente = await Entrega.findByPk(entregaId);
        if (!entregaExistente)
            res.status(404).json({ msg: "entrega não encontrada." });
        if (entregaExistente.status !== "Pendente")
            res.status(404).json({ msg: "entrega já realizada, não é possível atualizar." });
        else {
            if (entrega.descricao || entrega.status || entrega.valor) {
                await Entrega.update(entrega, {
                    where: { id: entregaId },
                });
                return res
                    .status(200)
                    .json({ msg: "entrega atualizada com sucesso." });
            } else
                return res
                    .status(400)
                    .json({ msg: "Campos obrigatórios não preenchidos." });
        }
	},

    async excluirPendente(req, res) {
		const entregaId = req.params.id;
        const entregaExistente = await Entrega.findByPk(entregaId);

        if (entregaExistente.status !== "Pendente")
            res.status(404).json({ msg: "entrega já realizada, não é possível excluir." });

		const entregaExcluida = await Entrega.destroy({
			where: { id: entregaId },
		}).catch(async (error) => {
            res.status(500).json({ msg: "Falha na conexão" });
		});

		if (entregaExcluida != 0)
			res.status(200).json({ msg: "entrega excluída com sucesso." });
		else res.status(404).json({ msg: "entrega não encontrada." });
	},
}