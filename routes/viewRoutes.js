const express = require("express")
const router = express.Router()

const {
    showHome,
    showLogin,
    showSignup
 } = require("../controllers/viewController")

router.get("/login", showLogin)

router.get("/signup", showSignup)

router.get("/", showHome)

router.all("*", (req, res) => { res.render("notFound") })

module.exports = router