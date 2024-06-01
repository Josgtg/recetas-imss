module.exports =
    constants = {
        // Códigos http
        VALIDATION_ERROR: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        SERVER_ERROR: 500,

        // Tipos de usuario
        ADMIN: "admin",
        MEDIC: "doctor",
        PATIENT: "paciente",

        // Estados de la receta
        REQUESTED: "solicitada",
        PROCESSING: "en proceso",
        SENT: "enviada",
        DELIVERED: "surtida",
    }