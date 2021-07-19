let jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        if(!req.headers) res.status(500).json({error: "Please provide the Header"})
        let token = req.headers.authorization.split(" ")[1]
        let decodedData = jwt.verify(token, process.env.JWT_KEY)
        req.expireToken = decodedData.exp
        
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Authentication failed"
        })
    }
}

