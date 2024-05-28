const constants = require("../constants.js")

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                title: "Validation failed",
                message: err.message,
            })
            break
        case constants.UNAUTHORIZED:
            res.json({
                title: "Unauthorized",
                message: err.message,
            })
            break
        case constants.FORBIDDEN:
            res.json({
                title: "Forbidden",
                message: err.message,
            })
            break
        case constants.NOT_FOUND:
            res.json({
                title: "Not found",
                message: err.message,
            })
            break
        case constants.METHOD_NOT_ALLOWED:
            res.json({
                title: "Method not allowed",
                message: err.message,
            })
            break
        case constants.SERVER_ERROR:
            console.log(err)
            res.json({
                title: "Server error",
                message: err.message,
            })
            break
        default:
            console.log(err)
            res.json({
                title: "Not known error (Probably my bad)",
                message: err.message,
            })
    }
}

module.exports = errorHandler