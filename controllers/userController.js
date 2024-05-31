const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const constants = require("../constants")

// GET /
const getAllUsers = asyncHandler( async (req, res) => {
    if (!req.session.loggedIn) {
        res.status(403)
        throw new Error("Necesitas iniciar sesión")
    }

    if (req.session.kind != constants.ADMIN) {
        res.status(403)
        throw new Error("No tienes acceso a este método")
    }

    let users = await User.find({}, {
        _id: 1,
        curp: 1,
        name: 1,
        kind: 1
    })

    userList = JSON.parse(JSON.stringify(users))

    userList.forEach(u => {
        u["id"] = u["_id"]
        delete u["_id"]
    });

    res.status(200).json(userList)
})

// GET /:id
const getOneUser = asyncHandler( async (req, res) => {
    if (!req.session.loggedIn) {
        res.status(403)
        throw new Error("Necesitas iniciar sesión")
    }

    if (req.session.kind == constants.PATIENT) {
        if (req.session.id != req.params.id) {
            res.status(403)
            throw new Error("No tienes acceso a este método")
        }
    }

    try {
        var user = await User.findOne({ _id: req.params.id }, {
            _id: 1,
            curp: 1,
            name: 1,
            kind: 1
        })
    } catch (err) {
        res.status(400)
        throw new Error("El id especificado es inválido")
    }

    if (!user) {
        res.status(404)
        throw new Error("No se ha encontrado a ese usuario")
    }

    res.status(200).json({
        id: user._id,
        curp: user.curp,
        name: user.name,
        kind: user.kind
    })
})

// GET /curp/:curp
const getUserByCurp = asyncHandler( async (req, res) => {
    if (!req.session.loggedIn) {
        res.status(403)
        throw new Error("Necesitas iniciar sesión")
    }

    if (req.session.kind == constants.PATIENT) {
        if (req.session.curp != req.params.curp) {
            res.status(403)
            throw new Error("No tienes acceso a este método")
        }
    }

    let user = await User.findOne({ curp: req.params.curp }, {
        _id: 1,
        curp: 1,
        name: 1,
        kind: 1
    })

    if (!user) {
        res.status(404)
        throw new Error("No se ha encontrado a ese usuario")
    }

    res.status(200).json({
        id: user._id,
        curp: user.curp,
        name: user.name,
        kind: user.kind
    })
})


// POST /signup
const registerUser = asyncHandler( async (req, res) => {
    let { curp, password, name, kind } = req.body
    if (!curp || !password || !name || !kind) {
        res.status(400)
        throw new Error("Se necesitan los campos: curp, password, name, kind")
    }

    if (await User.findOne({ curp })) {
        res.status(400)
        throw new Error("Ya hay un usuario registrado con esa CURP")
    }

    let hashedPassword = await bcrypt.hash(password, 11)

    let user = await User.create({
        curp, password: hashedPassword, name, kind
    })

    if (user) {
        req.session.loggedIn = true
        req.session.user_id = user._id
        req.session.curp = user.curp
        req.session.name = user.name
        req.session.kind = user.kind
        console.log(req.session)
        res.status(200).json({
            id: user._id,
            curp: user.curp,
            name: user.name,
            kind: user.kind
        })
        // res.redirect("/")
    } else {
        res.status(400)
        throw new Error("La CURP o la contraseña son incorrectas")
    }
})


// POST /login
const loginUser = asyncHandler( async (req, res) => {
    let { curp, password } = req.body

    if (!curp || !password) {
        res.status(400)
        throw new Error("Se necesitan ambos campos")
    }

    let user = await User.findOne({ curp })

    if (user && (await bcrypt.compare(password, user.password))) {
        req.session.loggedIn = true
        req.session.user_id = user._id
        req.session.curp = user.curp
        req.session.name = user.name
        req.session.kind = user.kind
        res.status(200).json({
            id: user._id,
            curp: user.curp,
            name: user.name,
            kind: user.kind
        })
        // res.redirect("/")
    } else {
        res.status(400)
        throw new Error("La CURP o la contraseña son incorrectas")
    }
})

const getCurrentUser = asyncHandler( async (req, res) => {
    if (!req.session.loggedIn) {
        res.status(400)
        throw new Error("Necesitas iniciar sesión")
    }
    
    res.status(200).json({
        id: req.session.user_id,
        curp: req.session.curp,
        name: req.session.name,
        kind: req.session.kind
    })
})

// DELETE /:id
const deleteUser = asyncHandler( async (req, res) => {
    if (!req.session.loggedIn) {
        res.status(403)
        throw new Error("Necesitas iniciar sesión")
    }

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

    res.status(200).json({
        id: user._id,
        curp: user.curp,
        name: user.name,
        kind: user.kind
    })
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