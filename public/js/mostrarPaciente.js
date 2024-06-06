formCurp = document.getElementById("patient")

async function getUserByCurp() {
    let curp = document.getElementById("curp").value
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

async function mostrar(e){
    e.preventDefault()
    let user = await getUserByCurp()
    if (!user) {
        return
    }
    document.getElementById("patient-name").innerHTML = user.name
    document.getElementById('paciente').style.display = 'block';
}

formCurp.addEventListener("submit", mostrar)