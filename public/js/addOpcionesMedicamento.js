/* 
<div class="medicamento">
<h5>Medicamento 1</h5>
<div class="d-flex">
    <select class="form-select" class="med-select" name="medicamento1">
        <option>Selecciona el medicamento...</option>
        
    </select>
    <input type="text" class="form-control" min="1" max="99" placeholder="Cant.">
</div>
</div>



A AÑADIR A LA BASE DE DATOS
<option value="nolotil">Nolotil</option>
<option value="adiro_100">Adiro 100</option>
<option value="paracetamol">Paracetamol</option>
<option value="ibuprofeno">Ibuprofeno</option>
<option value="omeprazol">Omeprazol</option>
<option value="amoxicilina">Amoxicilina</option>
<option value="aspirina">Aspirina</option>
<option value="enalapril">Enalapril</option>
<option value="losartan">Losartan</option>
<option value="metformina">Metformina</option>
<option value="atorvastatina">Atorvastatina</option>
<option value="loratadina">Loratadina</option>
<option value="salbutamol">Salbutamol</option>
<option value="simvastatina">Simvastatina</option>
<option value="ranitidina">Ranitidina</option>
<option value="amlodipino">Amlodipino</option>
<option value="clonazepam">Clonazepam</option>
<option value="diclofenaco">Diclofenaco</option>
<option value="levotiroxina">Levotiroxina</option>
<option value="cetirizina">Cetirizina</option>
*/

const medicamentos = document.getElementById("medicamentos")

async function getMedicineFromDb() {
    let res = await fetch("api/medicinas/", {
        method: "GET",
        headers: { 
            "Content-Type": "application/json",
        },
    })

    if (res.status === 200) {
        console.log("OKOKOKOKO")
        return res.json()
    }

    console.log("NOMAMES ALGO SALIÓ MAL")
    return res.json()
}

async function addOptions() {
    medicineList = await getMedicineFromDb()
    console.log(medicineList)
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
    medicamentos.innerHTML = medicamentosHtml
}

window.onload = addOptions()