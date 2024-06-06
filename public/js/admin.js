document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('usuarios-btn').addEventListener('click', loadUsuarios);
    document.getElementById('recetas-btn').addEventListener('click', loadRecetas);
    document.getElementById('medicinas-btn').addEventListener('click', loadMedicinas);
});

async function loadUsuarios() {
    fetch('/api/usuarios')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Lista de Usuarios</h2>';
            data.forEach(usuario => {
                const userDiv = document.createElement('div');
                userDiv.className = 'col-12 mb-2';
                userDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${usuario.name}</h5>
                            <p class="card-text">CURP: ${usuario.curp}</p>
                            <p class="card-text">ROL: ${usuario.kind}</p>
                            <button class="btn btn-danger" onclick="eliminarUsuario('${usuario.curp}')">Eliminar Usuario</button>
                        </div>
                    </div>`;
                content.appendChild(userDiv);
            });
        });
}

async function loadRecetas() {
    fetch('/api/recetas')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Lista de Recetas</h2>';
            data.forEach(receta => {
                const recetaDiv = document.createElement('div');
                recetaDiv.className = 'col-12 mb-2';
                recetaDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Receta de ${receta.patient}</h5>
                            <p class="card-text">Medico al que pertenece la receta: ${receta.doctor}</p>
                            <p class="card-text">Residencia del paciente: ${receta.residence}</p>
                            <p class="card-text">Medicina: ${receta.medicine}</p>
                            <p class="card-text">Cantidad: ${receta.quantity}</p>
                            <p class="card-text">Estado de la receta: ${receta.state}</p>
                            <button class="btn btn-danger" onclick="eliminarReceta('${receta.patient}')">Eliminar receta</button>
                        </div>
                    </div>`;
                content.appendChild(recetaDiv);
            });
        });
}

async function loadMedicinas() {
    fetch('/api/medicinas')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Lista de Medicinas</h2>';
            data.forEach(medicina => {
                const medicinaDiv = document.createElement('div');
                medicinaDiv.className = 'col-12 mb-2';
                medicinaDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${medicina.name}</h5>
                            <p class="card-text">Clave: ${medicina.clave}</p>
                            <p class="card-text">Descripción: ${medicina.description}</p>
                            <button class="btn btn-danger" onclick="eliminarMedicina('${medicina.clave}')">Eliminar medicina</button>
                        </div>
                    </div>`;
                content.appendChild(medicinaDiv);
            });
        });
}

async function eliminarUsuario(curp) {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
        fetch(`/api/usuarios/${curp}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Usuario eliminado exitosamente');
                loadUsuarios();
            } else {
                alert('Error al eliminar el usuario');
            }
        });
    }
}

async function eliminarReceta(receta) {
    if (confirm("¿Está seguro de que desea eliminar esta receta?")) {
        fetch(`/api/recetas/${receta}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Receta eliminado exitosamente');
                loadRecetas();
            } else {
                alert('Error al eliminar receta');
            }
        });
    }
}

async function eliminarMedicina(medicina) {
    if (confirm("¿Está seguro de que desea eliminar esta medicina?")) {
        fetch(`/api/medicinas/${medicina}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Medicina eliminada exitosamente');
                loadMedicinas();
            } else {
                alert('Error al eliminar medicina');
            }
        });
    }
}