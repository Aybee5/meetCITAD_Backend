const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decodedData = jwt.verify(token, process.env.JWT_KEY)
        req.userInfos = decodedData
        next()
    } catch (error) {
        return res.json({
            message: "Authentication failed"
        })
    }
}