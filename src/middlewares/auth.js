const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"];
    if (!token)
        return res.status(401).json({ msg: "token indefnido "});
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).json({ msg: "falha na autenticaçao do token" });
        
        req.sellerId = decoded.id;
        next();
    })
}

module.exports = verifyJWT;