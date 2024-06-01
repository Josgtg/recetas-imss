const express = require("express")
const router = express.Router()

const {
    getAllPres,
    getOnePres,
    addPres,
    changeStatus,
    updatePres,
    deletePres,
    notAllowed
} = require("../controllers/presController")

router.use(require("../middleware/checkSession"))

router.route("/")
    .get(getAllPres)
    .post(addPres)
    .all(notAllowed)

router.route("/:id")
    .get(getOnePres)
    .put(updatePres)
    .patch(changeStatus)
    .delete(deletePres)
    .all(notAllowed)

router.all("*", (req, res) => {
    res.status(404)
    throw new Error("La dirección que estás solicitando no existe")
})

module.exports = router