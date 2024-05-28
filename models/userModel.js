const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        curp: {
            type: String,
            required: [true, "La CURP es obligatoria"],
            unique: [true, "Ya hay un usuario con esta CURP"]
        },
        password: {
            type: String,
            required: [true, "El usuario necesita una contraseña"],
        },
        name: {
            type: String,
            required: [true, "Por favor, añade el nombre del usuario"]
        },
        kind: {
            // Usar las constantes!
            type: String,
            required: [true, "Es necesario conocer el tipo de usuario"]
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)