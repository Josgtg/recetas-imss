const mongoose = require("mongoose")

const prescriptionSchema = mongoose.Schema(
    {
        medic_id: {
            // Médico del usuario al que pertenece la receta
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        user_id: {
            // Usuario al que pertenece la receta
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        domicile: {
            type: String,
            required: [
                true,
                "Es necesario saber dónde se entregará la receta"
            ]
        },
        medicine: [{
            type: mongoose.Schema.Types.ObjectId,
            required: [
                true,
                "Es necesario saber los medicamentos que contiene la receta"
            ],
            ref: "Medicine"
        }],
        state: {
            // Es importante usar las constantes para evitar confusiones
            type: String,
            required: [
                true,
                "Es necesario saber el estado de la receta"
            ]
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Prescription", prescriptionSchema)