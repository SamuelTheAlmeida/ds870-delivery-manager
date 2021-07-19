const Associado = require("../models/Associado");
const Motoboy = require("../models/Motoboy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function gerarToken(id, role) {
    const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "5h",
    });
    return token;
}

function autenticarUsuario(res, senha, usuario, perfil) {
    if (bcrypt.compareSync(senha, usuario.senha)) {
        const token = gerarToken(usuario.id, perfil);
        return res.status(200).json({ msg: "Autenticado com sucesso", token });
    }
    else
        return res.status(404).json({ msg: "Usuário ou senha inválidos" });
}

module.exports = {
    async login(req, res) {
        const login = req.body.login;
        const senha = req.body.senha;

        if (!login || !senha)
            return res.status(400).json({ msg: "Dados inválidos" });

        try {
            const associado = await Associado.findOne({
                where: { CNPJ: login },
            });
            if (associado) 
                return autenticarUsuario(res, senha, associado, "associado");

            const motoboy = await Motoboy.findOne({
                where: { CPF: login },
            });

            if (motoboy) 
                return autenticarUsuario(res, senha, motoboy, "motoboy");

            return res.status(404).json({ msg: "Usuário ou senha inválidos"});
           
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}