const Associado = require("../models/Associado");
const Entrega = require("../models/Entrega");
const Cliente = require("../models/Cliente");

const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

function novoAssociadoValidator(req, res) {
    const body = req.body;
    const schema = Joi.object().keys({
        nomeEmpresa: Joi.string().required().max(255),
        CNPJ: Joi.string().required().min(14).max(14),
        senha: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
            .required().max(255),
        endereco: Joi.string().optional(),
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
        const { nomeEmpresa, CNPJ, senha, endereco } = req.body;
        const { validator, error } = novoAssociadoValidator(req, res);
        if (!validator) {
            return res.status(422).json({
                msg: "dados inválidos",
                error: error[0].message
            })
        }

        const cnpjExiste = await Associado.findOne({
            where: { CNPJ },
        });
        if (cnpjExiste)
            return res.status(400).json({ msg: "CNPJ já existente" });

        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(senha, salt);
        const associado = await Associado.create({
            nomeEmpresa,
            CNPJ,
            senha: hash,
            endereco
        }).catch((error) => {
            return res.status(500).json({ msg: "não foi possivel inserir os dados" });
        });

        if (associado)
            return res.status(201).json({ msg: "novo associado foi adicionado" });
        else
            return res.status(404).json({ msg: "não foi possivel cadastrar novo associado" });
    },

    async listarTodos(req, res) {
        const associados = await Associado.findAll({
            order: [["nomeEmpresa", "ASC"]],
        }).catch((error) => {
            console.log(error);
            return res.status(500).json({ msg: "Falha na conexão" });
        });
        if (associados) return res.status(200).json({ associados });
        else
            return res.status(404).json({ msg: "Não foi possivel encontrar associados "})
    },

    async buscarPorCNPJ(req, res) {
        const CNPJ = req.body.CNPJ;
        
        const Op = Sequelize.Op;
        const associado = await Associado.findOne({
            where: { CNPJ: { [Op.like]: "%" + CNPJ + "%" }},
        });
        if (associado) {
            if (associado === '')
                res.status(404).json({ msg: "associado não encontrado "});
            else res.status(200).json(associado);
        } else {
            res.status(404).json({ 
                msg: "associado não encontrado"
            });
        }
    },

    async atualizar(req, res) {
		const associadoId = req.body.id;
		const associado = req.body;
        const associadoExiste = await Associado.findByPk(associadoId);
        if (!associadoExiste)
            res.status(404).json({ msg: "associado não encontrado." });
        else {
            if (associado.CNPJ) {
                const cnpjExiste = await Associado.findOne({
                    where: { CNPJ: associado.CNPJ },
                });
                if (cnpjExiste)
                    return res.status(400).json({ msg: "CNPJ já existente" });
            }

            if (associado.nomeEmpresa || associado.CNPJ || associado.endereco) {
                await Associado.update(associado, {
                    where: { id: associadoId },
                });
                return res
                    .status(200)
                    .json({ msg: "associado atualizado com sucesso." });
            } else
                return res
                    .status(400)
                    .json({ msg: "Campos obrigatórios não preenchidos." });
        }
	},

    async excluir(req, res) {
		const associadoId = req.params.id;

        const idsClientes = await Cliente.findAll({
            where: { associadoId },
            attributes: ['id']
        });

        idsClientes.forEach(function (id) {
            Entrega.destroy({
                where: { clienteId: id }
            });
        });


		const associadoExcluido = await Associado.destroy({
			where: { id: associadoId },
		}).catch(async (error) => {
            return res.status(500).json({ msg: error});
		});

		if (associadoExcluido != 0)
			return res.status(200).json({ msg: "associado excluido com sucesso." });
		else res.status(404).json({ msg: "associado não encontrado." });
	},
}