const mongoose = require("mongoose")

const medicineSchema = mongoose.Schema(
    {
        /*
        La clave no está incluida debido a que asumo que es lo mismo que el
        id que mongo asigna automáticamente
        */
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