const Motoboy = require("../models/Motoboy");

const Sequelize = require("sequelize");
const Joi = require("joi");

function validarPerfil(req, perfis, res) {
    if (!perfis.includes(req.perfil) || !req.id)
        return res.status(403).json({ msg: "Acesso não permitido." });
}

function novoMotoboyValidator(req, res) {
    const body = req.body;
    const schema = Joi.object().keys({
        nome: Joi.string().required().max(255),
        CPF: Joi.string().required().min(11).max(11),
        senha: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
            .required().max(255),
        telefone: Joi.string().required().min(8).max(11)
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
        validarPerfil(req, ["associado"], res);
        
        const { nome, CPF, senha, telefone } = req.body;
        const { validator, error } = novoMotoboyValidator(req, res);
        if (!validator) {
            return res.status(422).json({
                msg: "dados inválidos",
                error: error[0].message
            })
        }

        const cpfExiste = await Motoboy.findOne({
            where: { CPF }
        });

        if (cpfExiste)
            res.status(403).json({ msg: "CPF já cadastrado "});
        else {
            const motoboy = await Motoboy.create({
                nome,
                CPF,
                senha,
                telefone
            }).catch((error) => {
                res.status(500).json({ msg: "não foi possivel inserir os dados" });
            });

            if (motoboy)
                res.status(201).json({ msg: "novo motoboy foi adicionado" });
            else
                res.status(404).json({ msg: "não foi possivel cadastrar novo motoboy" });
        }
    },

    async listarTodos(req, res) {
        validarPerfil(req, ["associado"], res);

        const motoboys = await Motoboy.findAll({
            order: [["nome", "ASC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (motoboys) res.status(200).json({ motoboys });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar motoboys "})
    },

    async buscarPorCPF(req, res) {
        validarPerfil(req, ["associado"], res);

        const CPF = req.body.CPF;
        
        const Op = Sequelize.Op;
        const motoboy = await Motoboy.findOne({
            where: { CPF: { [Op.like]: "%" + CPF + "%" }},
        });
        if (motoboy) {
            if (motoboy === '')
                res.status(404).json({ msg: "motoboy não encontrado "});
            else res.status(200).json(motoboy);
        } else {
            res.status(404).json({ 
                msg: "motoboy não encontrado"
            });
        }
    },

    async atualizar(req, res) {
        validarPerfil(req, ["associado"], res);

		const motoboyId = req.body.id;
		const motoboy = req.body;
        const motoboyExiste = await Motoboy.findByPk(motoboyId);
        if (!motoboyExiste)
            res.status(404).json({ msg: "motoboy não encontrado." });
        else {
            if (motoboy.CPF) {
                const cpfExiste = await Motoboy.findOne({
                    where: { CPF: motoboy.CPF },
                });
                if (cpfExiste)
                    return res.status(400).json({ msg: "CPF já existente" });
            }

            if (motoboy.nome || motoboy.CPF || motoboy.telefone) {
                await Motoboy.update(motoboy, {
                    where: { id: motoboyId },
                });
                return res
                    .status(200)
                    .json({ msg: "motoboy atualizado com sucesso." });
            } else
                return res
                    .status(400)
                    .json({ msg: "Campos obrigatórios não preenchidos." });
        }
	},

    async excluir(req, res) {
        validarPerfil(req, ["associado"], res);
        
		const motoboyId = req.params.id;
		const motoboyExcluido = await Motoboy.destroy({
			where: { id: motoboyId },
		}).catch(async (error) => {
            res.status(500).json({ msg: "Falha na conexão" });
		});

		if (motoboyExcluido != 0)
			res.status(200).json({ msg: "motoboy excluído com sucesso." });
		else res.status(404).json({ msg: "motoboy não encontrado." });
	},
}