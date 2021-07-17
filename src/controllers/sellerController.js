const Seller = require("../models/Seller");
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");
const Sale = require("../models/Sale");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

function newSellerValidator(req, res) {
    const body = req.body;
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net", "br" ]}
        }).required(),
        password: Joi.string().min(8).pattern(/^([\d]+[a-z]|[a-z]+[\d])[\da-z]*$/i)
            .required()
    });
    const { error, value } = schema.validate(body);
    if (error) return { validator: false, error: error.details }
    else return { validator: true, value };
}

function generateToken(id) {
    process.env.JWT_SECRET = Math.random().toString(36).slice(-20);
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
    });
    return token;
}

module.exports = {
    async listAllSellers(req, res) {
        const sellers = await Seller.findAll({
            order: [["name", "ASC"]],
        }).catch((error) => {
            res.status(500).json({ msg: "Falha na conexão" });
        });
        if (sellers) res.status(200).json({ sellers });
        else
            res.status(404).json({ msg: "Não foi possivel encontrar vendedores "})
    },

    async searchSellerByName(req, res) {
        const name = req.body.name;
        
        const Op = Sequelize.Op;
        const seller = await Seller.findAll({
            where: { name: { [Op.like]: "%" + name + "%" }},
        });
        console.log(seller);
        if (seller) {
            if (seller === '')
                res.status(404).json({ msg: "vendedor nao encontrado "});
            else res.status(200).json({ seller });
        } else {
            res.status(404).json({ 
                msg: "vendedor nao encontrado"
            });
        }
    },

    async newSeller(req, res) {
        const { name, email, password } = req.body;

        const { validator, value } = newSellerValidator(req, res);
        if (!validator) {
            return res.status(422).json({
                msg: "daods invalidos",
                error: value.error[0].message
            })
        }

        const sellerExists = await Seller.findOne({
            where: { email }
        });

        if (sellerExists)
            res.status(403).json({ msg: "vendedor ja cadastrado "});
        else {
            const salt = bcrypt.getSaltSync(12);
            const hash = bcrypt.hashSync(password, salt);

            const seller = await Seller.create({
                name,
                email,
                password: hash
            }).catch((error) => {
                res.status(500).json({ msg: "não foi possivel inserir os dados" });
            });

            if (seller)
                res.status(201).json({ msg: "novo vendedor foi adicionado" });
            else
                res.status(404).json({ msg: "não foi possivel cadastrar novo vendedor" });
        }
    },

	async deleteSeller(req, res) {
		const sellerId = req.params.id;
		const deletedSeller = await Seller.destroy({
			where: { id: sellerId },
		}).catch(async (error) => {
			const sellerHasRef = await Sale.findOne({
				where: { sellerId },
			}).catch((error) => {
				res.status(500).json({ msg: "Falha na conexão." });
			});
			if (sellerHasRef)
				return res
					.status(403)
					.json({ msg: "Vendedor possui vendas em seu nome." });
		});
		if (deletedSeller != 0)
			res.status(200).json({ msg: "Vendedor excluido com sucesso." });
		else res.status(404).json({ msg: "Vendedor não encontrado." });
	},

	async updateSeller(req, res) {
		const sellerId = req.body.id;
		const seller = req.body;
        const sellerExists = await Seller.findByPk(sellerId);
        if (!sellerExists)
            res.status(404).json({ msg: "Vendedor não encontrado." });
        else {
            if (seller.name || seller.email) {
                await Seller.update(seller, {
                    where: { id: sellerId },
                });
                return res
                    .status(200)
                    .json({ msg: "Vendedor atualizado com sucesso." });
            } else
                return res
                    .status(400)
                    .json({ msg: "Campos obrigatórios não preenchidos." });
        }
		
	},

    async authentication(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const seller = await Seller.findOne({
                where: { email },
            });
            if (!seller)
                return res.status(404).json({ msg: "Usuário ou senha inválidos "});
            else {
                if (bcrypt.compareSync(password, seller.password)) {
                    const token = generateToken(seller.id);
                    return res.status(200).json({ msg: "autenticado com sucesso ", token });
                }
                else
                    return res.status(404).json({ msg: "usuario ou senha invalidos" });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}