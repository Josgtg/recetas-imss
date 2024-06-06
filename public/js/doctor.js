async function getCurrentUser() {
    let res = await fetch("api/usuarios/current/", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    return await res.json()
}

async function setName() {
    let user = await getCurrentUser()
    let message = "¡Bienvenido, " + user.name + "!"
    document.getElementById("titulo-doctor").innerHTML = message
}

async function getMedicineFromDb() {
    let res = await fetch("api/medicinas/", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        },
    })

    return await res.json()
}

async function addOptions() {
    medicineList = await getMedicineFromDb()
    let options = ""
    let medicamentosHtml = ""
    medicineList.forEach(m => {
        options += `<option value="${m.id}">${m.name}</option>`
    })
    for (i = 1; i <= 10; i++) {
        medicamentosHtml += `
        <div class="medicamento">
        <h5>Medicamento ${i}</h5>
        <div class="d-flex">
            <select class="form-select" class="med-select" name="medicamento${i}">
                <option selected="true" value="">Selecciona el medicamento...</option>
                ${options}
            </select>
            <input type="text" class="form-control" name="cant${i}" min="1" max="99" placeholder="Cant.">
        </div>
        </div>
        `
    }
    medicamentosHtml += `
        <br><br>
        <div class="d-grid">
            <button type="submit" class="btn btn-lg btn-info">Solicitar</button>
        </div>
    `

    document.getElementById("medicamentos").innerHTML = medicamentosHtml
}

function setUi() {
    setName()
    addOptions()
}

window.onload = setUi()