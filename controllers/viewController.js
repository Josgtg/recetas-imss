const constants = require("../constants")

const showHome = (req, res) => {
    if (req.session.loggedIn) {
        switch (req.session.kind) {
            case (constants.ADMIN):
                res.render("admin")
                break
            case (constants.MEDIC):
                res.render("doc")
                break
            default:
                res.render("patient")
        }
        return
    }
    res.redirect("/login")
}

const showLogin = (req, res) => {
    res.render("login")
}

const showSignup = (req, res) => {
    res.render("signup")
}


module.exports = {
    showHome,
    showLogin,
    showSignup
 }