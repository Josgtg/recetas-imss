var formL = document.getElementById("login-form")

function getLoginData() {
    return Object.fromEntries(new FormData(formL).entries())
}

async function sendData(user, url) {
    let res = await fetch(url, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })

    if (res.status === 200) {
        window.location.href = "/"
        return
    }

    let errorData = await res.json();
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerHTML = errorData.message;

    return errorData;
}

function validateCURP(curp) {
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]{2}$/;
    return curpRegex.test(curp);
}

function validatePassword(password) {
    return password.length >= 8;
}

async function logUserIn(e) {
    e.preventDefault()
    let user = getLoginData()
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerHTML = '';

    if (!validateCURP(user.curp)) {
        errorDiv.innerHTML = 'CURP no válida. Debe tener el formato correcto.';
        return;
    }

    if (!validatePassword(user.password)) {
        errorDiv.innerHTML = 'La contraseña debe tener al menos 8 caracteres.';
        return;
    }

    let res = await sendData(user, "api/usuarios/login")
    console.log(res)
}

formL.addEventListener("submit", logUserIn)