const checkSession = (req, res, next) => {
    if (req.session.loggedIn) {
        next()
    } else {
        res.status(403)
        throw new Error("Necesitas iniciar sesión")
    }
}

module.exports = checkSession