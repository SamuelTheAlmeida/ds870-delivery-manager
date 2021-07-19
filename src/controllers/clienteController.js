const Cliente = require("../models/Cliente");

const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

function validarPerfil(req, perfil, res) {
    if (req.perfil !== perfil || !req.id)
        return res.status(403).json({ msg: "Acesso não permitido." });
}

function novoClienteValidator(req, res) {
    const body = req.body;
    const schema = Joi.object().keys({
        nomeEmpresa: Joi.string().required(),
        CNPJ: Joi.string().required().min(14).max(14),
        endereco: Joi.string().optional()
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
        validarPerfil(req, "associado", res);
        const associadoId = req.id;

        const { nomeEmpresa, CNPJ, endereco } = req.body;
        const { validator, error } = novoClienteValidator(req, res);
        if (!validator) {
            return res.status(422).json({
                msg: "dados inválidos",
                error: error[0].message
            });
        }

        const cnpjExiste = await Cliente.findOne({
            where: { CNPJ }
        });

        if (cnpjExiste)
            return res.status(403).json({ msg: "CNPJ já cadastrado "});
        else {
            const cliente = await Cliente.create({
                nomeEmpresa,
                CNPJ,
                endereco,
                associadoId
            }).catch((error) => {
                return res.status(500).json({ msg: error });
            });

            if (cliente)
                return res.status(201).json({ msg: "novo cliente foi adicionado" });
            else
                return res.status(404).json({ msg: "não foi possivel cadastrar novo cliente" });
        }
    },

    async listarTodos(req, res) {
        validarPerfil(req, "associado", res);
        
        const clientes = await Cliente.findAll({
            where: { associadoId: req.id },
            order: [["nomeEmpresa", "ASC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (clientes) res.status(200).json({ clientes });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar clientes "})
    },

    async buscarPorCNPJ(req, res) {
        validarPerfil(req, "associado", res);
        
        const CNPJ = req.body.CNPJ;
        
        const Op = Sequelize.Op;
        const cliente = await Cliente.findOne({
            where: { CNPJ: { [Op.like]: "%" + CNPJ + "%" }, associadoId: req.id},
        });
        if (cliente) {
            if (cliente === '')
                res.status(404).json({ msg: "cliente não encontrado "});
            else res.status(200).json(cliente);
        } else {
            res.status(404).json({ 
                msg: "cliente não encontrado"
            });
        }
    },

    async excluir(req, res) {
        validarPerfil(req, "associado", res);
        
		const clienteId = req.params.id;
		const clienteExcluido = await Cliente.destroy({
			where: { id: clienteId },
		}).catch(async (error) => {
            res.status(500).json({ msg: "Falha na conexão" });
		});

		if (clienteExcluido != 0)
			res.status(200).json({ msg: "cliente excluido com sucesso." });
		else res.status(404).json({ msg: "cliente não encontrado." });
	},
    
	async atualizar(req, res) {
        validarPerfil(req, "associado", res);
        
		const clienteId = req.body.id;
		const cliente = req.body;
        const clienteExiste = await Cliente.findByPk(clienteId);
        if (!clienteExiste)
            res.status(404).json({ msg: "cliente não encontrado." });
        else {
            if (cliente.CNPJ) {
                const cnpjExiste = await Cliente.findOne({
                    where: { CNPJ: cliente.CNPJ },
                });
                if (cnpjExiste)
                    return res.status(400).json({ msg: "CNPJ já existente" });
            }

            if (cliente.nomeEmpresa || cliente.CNPJ || cliente.endereco) {
                await Cliente.update(cliente, {
                    where: { id: clienteId },
                });
                return res
                    .status(200)
                    .json({ msg: "cliente atualizado com sucesso." });
            } else
                return res
                    .status(400)
                    .json({ msg: "Campos obrigatórios não preenchidos." });
        }
	}
}