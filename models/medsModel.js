const mongoose = require("mongoose")

const medicineSchema = mongoose.Schema(
    {
        clave: {
            type: String,
            required: [
                true,
                "La medicina necesita una clave que la identifique"
            ],
            unique: [
                true,
                "Ya existe una medicina con esa clave"
            ]
        },
        name: {
            type: String,
            required: [
                true,
                "Por favor, añade el nombre del medicamento"
            ] 
        },

        description: {
            type: String,
            required: [
                true,
                "Por favor, añade una descripción para el medicamento"
            ]
        },
    },
    {
        // Añade datos de cuándo se añadió el documento a la db
        timestamps: true
    }
)

module.exports = mongoose.model("Medicine", medicineSchema)