const mongoose = require("mongoose")

const prescriptionSchema = mongoose.Schema(
    {
        doctor: {
            // Médico del usuario al que pertenece la receta
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        patient: {
            // Curp del usuario al que pertenece la receta
            type: String,
            required: [
                true,
                "Es necesario saber para quién va dirigida esta receta"
            ],
            ref: "User"
        },
        domicile: {
            type: String,
            required: [
                true,
                "Es necesario saber dónde se entregará la receta"
            ]
        },
        medicine: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: [
                    true,
                    "Es necesario saber los medicamentos que contiene la receta"
                ],
                ref: "Medicine"
            },
        ],
        quantity: [
            {
                type: Number,
                required: [
                    true,
                    "Se necesita saber la cantidad de este medicamento"
                ]
            }
        ],
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