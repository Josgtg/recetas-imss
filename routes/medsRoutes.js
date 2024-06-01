const express = require("express")
const router = express.Router()

const {
    getAllMedicine,
    getOneMedicine,
    getMedicineByClave,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    notAllowed
} = require("../controllers/medsController")

router.use(require("../middleware/checkSession"))

router.route("/")
    .get(getAllMedicine)
    .post(addMedicine)
    .all(notAllowed)

router.route("/clave/:clave")
    .get(getMedicineByClave)
    .all(notAllowed)

router.route("/:id")
    .get(getOneMedicine)
    .put(updateMedicine)
    .delete(deleteMedicine)
    .all(notAllowed)

router.all("*", (req, res) => {
    res.status(404)
    throw new Error("La dirección que estás solicitando no existe")
})

module.exports = router