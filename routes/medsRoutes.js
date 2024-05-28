const express = require("express")
const router = express.Router()

const {
    getAllUsers,
    getOneUser,
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
    .get(getCurrentUser)
    .all(notAllowed)

router.route("/:id")
    .get(getOneUser)
    .delete(deleteUser)
    .all(notAllowed)

router.route("/")
    .get(getAllUsers)
    .all(notAllowed)

router.all("*", (req, res) => {
    res.status(404)
    throw new Error("La dirección que estás solicitando no existe")
})

module.exports = router