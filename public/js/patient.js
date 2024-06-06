async function getUserById(id) {
    let res = await fetch("api/usuarios/" + id, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    if (res.status === 200) {
        return res.json()
    }

    return
}

async function getPresById(id) {
    let res = await fetch("api/recetas/" + id, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    if (res.status === 200) {
        return res.json()
    }

    return
}

async function getMedById(id) {
    let res = await fetch("api/medicinas/" + id, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    if (res.status === 200) {
        return await res.json()
    }

    return
}

async function getUserByCurp(curp) {
    let res = await fetch("api/usuarios/curp/" + curp, {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    if (res.status === 200) {
        return res.json()
    }

    return
}

async function marcarSurtida(id) {
    let res = await fetch("api/recetas/" + id, {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "surtida" })
    })

    if (res.status === 200) {
        let b = document.getElementById(id)
        b.innerHTML = "Surtida"
        b.disabled = "true"
        return await res.json()
    }

    return
}

async function createMedicineList(ids) {
    let medList = []
    for (let id of ids) {
        let med = await getMedById(id)
        medList.push(med.name)
    }
    return medList
}

async function descargar(id) {
    let pres = await getPresById(id)
    if (!pres) {
        return
    }

    let medicinas = ""
    var counter = 0

    var medicinasList = await createMedicineList(pres.medicine)

    medicinasList.forEach(m => {
        medicinas += pres.quantity[counter] + " "
        medicinas += m + ", "
        counter++
    })

    if (pres.state == "surtida") {
        let b = document.getElementById(id)
        b.innerHTML = "Surtida"
        b.disabled = "true"
    }

    let doc = await getUserById(pres.doctor)
    let patient = await getUserByCurp(pres.patient)

    let text = `Doctor: ${doc.name}\nPaciente: ${patient.name}\nDomicilio: ${pres.residence}\nMedicinas: ${medicinas}\nEstado: ${pres.state}`

    let download = document.getElementById("presDownload")
    download.style = "display: inherit;"
    let name = "Receta.txt"
    let file = new Blob([text], {type: "text/plain"})
    download.href = URL.createObjectURL(file)
    download.download = name
}

async function getCurrentUser() {
    let res = await fetch("api/usuarios/current/", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    return await res.json()
}

async function getRecetas() {
    let res = await fetch("api/recetas/", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        }
    })

    return await res.json()
}

async function setTitle() {
    let user = await getCurrentUser()
    document.getElementById("patient-name").innerHTML = "Bienvenido, " + user.name
}

async function createTable() {
    let recetas = await getRecetas()
    let tableBody = ""
    let counter = 0
    recetas.forEach(r => {
        counter++ 
        tableBody += `
        <tr class="table-light">
            <th scope="row">${counter}</th>
            <td>Receta ${counter}</td>
            <td>${r.state}</td>
            <td>
                <button type="button" id="${r.id}" onclick="marcarSurtida('${r.id}')">Marcar como surtida</button>
                <button type="button" onclick="descargar('${r.id}')">Crear archivo</button>
                <a href="" id="presDownload" style="display: none;">Descarga tu receta</a>
            </td>
        </tr>
        `
    })

    let tableHTML = `
    <table class="table table-hover">
        <thead>
            <tr class="table-primary">
                <th scope="col">Número</th>
                <th scope="col">Nombre</th>
                <th scope="col">Estado</th>
                <th scope="col"> Acciones</th>
            </tr>
        </thead>
        <tbody>
            ${tableBody}
        </tbody>
    </table>
    `

    document.getElementById("tabla-medicina").innerHTML = tableHTML
}

async function setUi() {
    await setTitle()
    await createTable()
}

window.onload = setUi()