const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const constants = require("../constants")

// Funciones de ayuda

const ifPatientCheckSameId = (req) => {
    if (req.session.kind == constants.PATIENT) {
        if (req.session.id != req.params.id) {
            res.status(403)
            throw new Error("No tienes acceso a este método")
        }
    }
}

const changeAttrName = (oldName, newName, obj) => {
    newObj = JSON.parse(JSON.stringify(obj))

    newObj.forEach(u => {
        u[newName] = u[oldName]
        delete u[oldName]
    });

    return newObj
}

const returnUser = (res, user) => {
    res.status(200).json({
        id: user._id,
        curp: user.curp,
        name: user.name,
        kind: user.kind
    })
}

const createCookie = (req, user) => {
    // Se crea un atributo nuevo en la petición, que es quien guarda los datos de la sesión
    req.session.loggedIn = true
    req.session.user_id = user._id
    req.session.curp = user.curp
    req.session.name = user.name
    req.session.kind = user.kind
}

// Funcionalidad de la api

// GET /
const getAllUsers = asyncHandler( async (req, res) => {
    if (req.session.kind != constants.ADMIN) {
        res.status(403)
        throw new Error("No tienes acceso a este método")
    }

    // User.find(filtro, selección)
    let users = await User.find({}, { password: 0 })

    users = changeAttrName("_id", "id", users)

    res.status(200).json(users)
})

// GET /:id
const getOneUser = asyncHandler( async (req, res) => {
    ifPatientCheckSameId(req)

    try {
        // User.findOne(filtro, selección)
        var user = await User.findOne({ _id: req.params.id }, { password: 0 })
    } catch (err) {
        res.status(400)
        throw new Error("El id especificado es inválido")
    }

    if (!user) {
        res.status(404)
        throw new Error("No se ha encontrado a ese usuario")
    }

    returnUser(res, user)
})

// GET /curp/:curp
const getUserByCurp = asyncHandler( async (req, res) => {
    ifPatientCheckSameId(req)

    let user = await User.findOne({ curp: req.params.curp }, { password: 0 })

    if (!user) {
        res.status(404)
        throw new Error("No se ha encontrado a ese usuario")
    }

    returnUser(res, user)
})


// POST /signup
const registerUser = asyncHandler( async (req, res) => {
    // Busca atributos con el mismo nombre en el cuerpo de la petición
    let { curp, password, name, kind } = req.body

    if (!curp || !password || !name || !kind) {
        res.status(400)
        throw new Error("Se necesitan los campos: curp, password, name, kind")
    }

    if (
        kind != constants.ADMIN &&
        kind != constants.MEDIC &&
        kind != constants.PATIENT
    ) {
        res.status(400)
        throw new Error("El tipo de usuario está en un formato inválido")
    }

    if (await User.findOne({ curp })) {
        res.status(400)
        throw new Error("Ya hay un usuario registrado con esa CURP")
    }

    // Es importante encriptar la contraseña
    let hashedPassword = await bcrypt.hash(password, 11)

    let user = await User.create({
        curp, password: hashedPassword, name, kind
    })

    if (user) {
        createCookie(req, user)
        returnUser(res, user)
    } else {
        res.status(400)
        throw new Error("La CURP o la contraseña son incorrectas")
    }
})


// POST /login
const loginUser = asyncHandler( async (req, res) => {
    // Busca atributos con el mismo nombre en el cuerpo de la petición
    let { curp, password } = req.body

    if (!curp || !password) {
        res.status(400)
        throw new Error("Se necesitan ambos campos")
    }

    let user = await User.findOne({ curp })

    // Se desencripta la contraseña y se compara con la del cuerpo de la petición
    if (user && (await bcrypt.compare(password, user.password))) {
        createCookie(req, user)
        returnUser(res, user)
    } else {
        res.status(400)
        throw new Error("La CURP o la contraseña son incorrectas")
    }
})

const getCurrentUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        id: req.session.user_id,
        curp: req.session.curp,
        name: req.session.name,
        kind: req.session.kind
    })
})

// DELETE /:id
const deleteUser = asyncHandler( async (req, res) => {
    if (req.session.id != req.params.id || req.session.kind != constants.ADMIN) {
        res.status(403)
        throw new Error("No tienes acceso a este método")
    }

    let user = await User.findById(req.params.id)

    if (!user) {
        res.status(404)
        throw new Error("No se ha encontrado a ese usuario")
    }

    await User.deleteOne({ _id: req.params.id })

    returnUser(res, user)
})

const notAllowed = asyncHandler( async (req, res) => {
    res.status(405)
    throw new Error("El método " + req.method + " no es válido para esta url")
})

module.exports = {
    getAllUsers,
    getOneUser,
    getUserByCurp,
    registerUser,
    loginUser,
    getCurrentUser,
    deleteUser,
    notAllowed
}