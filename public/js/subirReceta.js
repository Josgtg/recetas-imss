formReceta = document.getElementById("medicamentos-form")

function getFormData() {
    return Object.fromEntries(new FormData(formReceta).entries())
}

async function fixFormat() {
    let data = getFormData()
    let residence = `${data.calleYNum}, ${data.colonia}, ${data.ciudad}, ${data.estado}, ${data.cp}`
    let curp = document.getElementById("curp").value

    let medicine = []
    let quantity = []
    for (i = 1; i <= 10; i++) {
        if (data[`medicamento${i}`] && data[`cant${i}`]) {
            medicine.push(data[`medicamento${i}`])
            quantity.push(data[`cant${i}`])
        }
    }

    return {
        patient: curp,
        residence,
        medicine,
        quantity
    }
}

function exitoso() {
    alert('Formulario enviado correctamente.');
}

async function sendReceta() {
    let receta = await fixFormat()
    let res = await fetch("api/recetas/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(receta)
    })

    if (res.status === 200) {
       exitoso()
    }

    return res.json()
}

async function subirReceta(e) {
    e.preventDefault()
    let res = await sendReceta()
    console.log(res)
}

formReceta.addEventListener("submit", subirReceta)