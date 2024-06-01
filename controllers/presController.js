const asyncHandler = require("express-async-handler")
const Pres = require("../models/presModel")
const constants = require("../constants")

// GET /
const getAllPres = asyncHandler( async (req, res) => {
    let filter;
    switch (req.session.kind) {
        case constants.ADMIN:
            filter = {}
            break
        case constants.MEDIC:
            filter = { doctor: req.session.user_id }
            break
        default:
            filter = { patient: req.session.curp }
            break
    }

    let pres = await Pres.find(filter, {
        _id: 1,
        doctor: 1,
        patient: 1,
        domicile: 1,
        medicine: 1,
        state: 1
    })

    presList = JSON.parse(JSON.stringify(pres))

    presList.forEach(u => {
        u["id"] = u["_id"]
        delete u["_id"]
    });

    res.status(200).json(presList)
})

// GET /:id
const getOnePres = asyncHandler( async (req, res) => {
    try {
        var pres = await Pres.findOne({ _id: req.params.id }, {
            _id: 1,
            doctor: 1,
            patient: 1,
            domicile: 1,
            medicine: 1,
            state: 1
        })
    } catch (err) {
        res.status(400)
        throw new Error("El id especificado es inválido")
    }

    if (!pres) {
        res.status(404)
        throw new Error("No se ha encontrado esa receta")
    }

    if (req.session.kind != constants.ADMIN) {
        if (req.session.kind == constants.MEDIC) {
            if (req.session.user_id != pres.doctor) {
                res.status(403)
                throw new Error("No tienes permiso para ver esta receta")
            }
        } else {
            if (req.session.curp != pres.patient) {
                res.status(403)
                throw new Error("No tienes permiso para ver esta receta")
            }
        }
    }

    res.status(200).json({
        id: pres._id,
        doctor: pres.doctor,
        patient: pres.patient,
        domicile: pres.domicile,
        medicine: pres.medicine,
        state: pres.state
    })
})


// POST /
const addPres = asyncHandler( async (req, res) => {
    if (req.session.kind != constants.MEDIC) {
        res.status(403)
        throw new Error("Sólo los médicos pueden hacer recetas")
    }

    let { patient, domicile, medicine } = req.body
    if (!patient || !domicile || !medicine) {
        res.status(400)
        throw new Error("Se necesitan los campos: patient, domicile, medicine")
    }
    
    let pres = await Pres.create({
        doctor: req.session.user_id, patient, domicile, medicine, state: constants.REQUESTED
    })

    if (pres) {
        res.status(200).json({
            id: pres._id,
            doctor: pres.doctor,
            patient: pres.patient,
            domicile: pres.domicile,
            medicine: pres.medicine,
            state: pres.state
        })
    } else {
        res.status(400)
        throw new Error("Hubo un error... Revisa que los datos sean correctos")
    }
})


// PUT /id
const updatePres = asyncHandler( async (req, res) => {
    if (req.session.kind!= constants.MEDIC) {
        res.status(403)
        throw new Error("Sólo los médicos pueden modificar recetas")
    }

    let { patient, domicile, medicine } = req.body
    if (!patient || !domicile || !medicine) {
        res.status(400)
        throw new Error("Se necesitan los campos: patient, domicile, medicine")
    }

    let pres = await Pres.findById(req.params.id)

    if (!pres) {
        res.status(404)
        throw new Error("La receta que estás buscando no existe")
    }
    
    pres = await Pres.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    )

    if (pres) {
        res.status(200).json({
            id: pres._id,
            doctor: pres.doctor,
            patient: pres.patient,
            domicile: pres.domicile,
            medicine: pres.medicine,
            state: pres.state
        })
    } else {
        res.status(400)
        throw new Error("Hubo un error... Revisa que los datos sean correctos")
    }
})

// PATCH /:id
const changeStatus = asyncHandler( async (req, res) => {

    let { state } = req.body

    if (!state) {
        res.status(400)
        throw new Error("No se encontró el nuevo estado de la receta")
    }

    let pres = Pres.findById(req.params.id)

    if (!pres) {
        res.status(404)
        throw new Error("No se ha encontrado la receta")
    }

    if (state == constants.DELIVERED && req.session.kind != constants.PATIENT) {
        res.status(403)
        throw new Error("No tienes permiso para marcar esta receta como surtida")
    }

    if (
        state != constants.REQUESTED &&
        state != constants.PROCESSING &&
        state != constants.SENT &&
        state != constants.DELIVERED
    ) {
        res.status(400)
        throw new Error("El estado de la receta está en un formato inválido")
    }

    let updatedPres = await Pres.findByIdAndUpdate(
        req.params.id,
        {
            state: state
        },
        {
            new: true
        }
    )

    if (updatedPres) {
        res.json({
            id: updatedPres._id,
            doctor: updatedPres.doctor,
            patient: updatedPres.patient,
            domicile: updatedPres.domicile,
            medicine: updatedPres.medicine,
            state: updatedPres.state
        })
    } else {
        res.status(400)
        throw new Error(
            "No se pudo actualizar el estado de la receta. Revisa que los datos sean correctos"
        )
    }
})


// DELETE /id
const deletePres = asyncHandler( async (req, res) => {
    let pres = await Pres.findById(req.params.id)

    if (!pres) {
        res.status(404)
        throw new Error("La receta que estás buscando no existe")
    }

    if (req.session.kind != constants.ADMIN) {
        if (req.session.kind == constants.MEDIC) {
            if (req.session.user_id != pres.doctor) {
                res.status(403)
                throw new Error("No tienes permiso para eliminar esta receta")
            }
        } else {
            if (req.session.curp != pres.patient) {
                res.status(403)
                throw new Error("No tienes permiso para eliminar esta receta")
            }
        }
    }
    
    pres = await Pres.findByIdAndDelete(req.params.id)

    if (pres) {
        res.status(200).json({
            id: pres._id,
            doctor: pres.doctor,
            patient: pres.patient,
            domicile: pres.domicile,
            medicine: pres.medicine,
            state: pres.state
        })
    } else {
        res.status(400)
        throw new Error("No fue posible eliminar la receta")
    }
})

const notAllowed = asyncHandler( async (req, res) => {
    res.status(405)
    throw new Error("El método " + req.method + " no es válido para esta url")
})

module.exports = {
    getAllPres,
    getOnePres,
    addPres,
    changeStatus,
    updatePres,
    deletePres,
    notAllowed
}