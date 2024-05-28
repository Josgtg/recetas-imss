const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router()

router.use("/usuarios", bodyParser.json(), require("./userRoutes"))

router.use("/recetas", bodyParser.json(), require("./presRoutes"))

router.use("/medicinas", bodyParser.json(), require("./medsRoutes"))

router.get("/", (req, res) => {
    res.json({
        title: "Visita el repositorio para saber más",
        message: "https://github.com/Josgtg/recetas_imss"
    }) 
})

router.all("*", (req, res) => {
    res.json({
        title: "La url es inválida",
        message: "La url que estás pidiendo no existe en la app"
    }) 
})

module.exports = router