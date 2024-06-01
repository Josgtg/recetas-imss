const express = require("express")
const router = express.Router()
const checkSession = require("../middleware/checkSession")

const {
    getAllUsers,
    getOneUser,
    getUserByCurp,
    registerUser,
    loginUser,
    getCurrentUser,
    deleteUser,
    notAllowed
} = require("../controllers/userController")

router.route("/signup")
    .post(registerUser)
    .all(notAllowed)

router.route("/login")
    .post(loginUser)
    .all(notAllowed)

router.route("/current")
    .get(checkSession, getCurrentUser)
    .all(notAllowed)

router.route("/curp/:curp")
    .get(checkSession, getUserByCurp)
    .all(notAllowed)

router.route("/:id")
    .get(checkSession, getOneUser)
    .delete(checkSession, deleteUser)
    .all(notAllowed)

router.route("/")
    .get(checkSession, getAllUsers)
    .all(notAllowed)

router.all("*", (req, res) => {
    res.status(404)
    throw new Error("La dirección que estás solicitando no existe")
})

module.exports = router