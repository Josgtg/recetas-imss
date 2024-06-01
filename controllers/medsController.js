const asyncHandler = require("express-async-handler")
const Med = require("../models/medsModel")
const constants = require("../constants")

// GET /
const getAllMedicine = asyncHandler( async (req, res) => {
    let medicine = await Med.find({}, {
        _id: 1,
        clave: 1,
        name: 1,
        description: 1
    })

    medList = JSON.parse(JSON.stringify(medicine))

    medList.forEach(u => {
        u["id"] = u["_id"]
        delete u["_id"]
    });

    res.status(200).json(medList)
})

// GET /:id
const getOneMedicine = asyncHandler( async (req, res) => {
    try {
        var medicine = await Med.findOne({ _id: req.params.id }, {
            _id: 1,
            clave: 1,
            name: 1,
            description: 1
        })
    } catch (err) {
        res.status(400)
        throw new Error("El id especificado es inválido")
    }

    if (!medicine) {
        res.status(404)
        throw new Error("No se ha encontrado esa medicina")
    }

    res.status(200).json({
        id: medicine._id,
        clave: medicine.clave,
        name: medicine.name,
        description: medicine.description
    })
})


// GET /clave/:clave
const getMedicineByClave = asyncHandler( async (req, res) => {
    let medicine = await Med.findOne({ clave: req.params.clave })

    if (!medicine) {
        res.status(404)
        throw new Error("No se ha encontrado esa medicina")
    }

    res.status(200).json({
        id: medicine._id,
        clave: medicine.clave,
        name: medicine.name,
        description: medicine.description
    })
})


// POST /
const addMedicine = asyncHandler( async (req, res) => {
    let { clave, name, description } = req.body
    if (!clave || !name || !description) {
        res.status(400)
        throw new Error("Se necesitan los campos: clave, name, description")
    }

    if (await Med.findOne({ clave })) {
        res.status(400)
        throw new Error("Ya hay una medicina registrada con esa clave")
    }
    
    let medicine = await Med.create({
        clave, name, description
    })

    if (medicine) {
        res.status(200).json({
            id: medicine._id,
            clave: medicine.clave,
            name: medicine.name,
            description: medicine.description
        })
    } else {
        res.status(400)
        throw new Error("Hubo un error... Revisa que los datos sean correctos")
    }
})


// PUT /id
const updateMedicine = asyncHandler( async (req, res) => {
    let { clave, name, description } = req.body
    if (!clave || !name || !description) {
        res.status(400)
        throw new Error("Se necesitan los campos: clave, name, description")
    }

    let medicine = await Med.findById(req.params.id)

    if (!medicine) {
        res.status(404)
        throw new Error("La medicina que estás buscando no existe")
    }
    
    medicine = await Med.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    )

    if (medicine) {
        res.status(200).json({
            id: medicine._id,
            clave: medicine.clave,
            name: medicine.name,
            description: medicine.description
        })
    } else {
        res.status(400)
        throw new Error("Hubo un error... Revisa que los datos sean correctos")
    }
})

// DELETE /id
const deleteMedicine = asyncHandler( async (req, res) => {
    if (req.session.kind != constants.ADMIN) {
        res.status(403)
        throw new Error("No tienes permiso para eliminar una medicina")
    }

    let medicine = await Med.findById(req.params.id)

    if (!medicine) {
        res.status(404)
        throw new Error("La medicina que estás buscando no existe")
    }
    
    medicine = await Med.findByIdAndDelete(req.params.id)

    if (medicine) {
        res.status(200).json({
            id: medicine._id,
            clave: medicine.clave,
            name: medicine.name,
            description: medicine.description
        })
    } else {
        res.status(400)
        throw new Error("No fue posible eliminar el medicamento")
    }
})

const notAllowed = asyncHandler( async (req, res) => {
    res.status(405)
    throw new Error("El método " + req.method + " no es válido para esta url")
})

module.exports = {
    getAllMedicine,
    getOneMedicine,
    getMedicineByClave,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    notAllowed
}