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

    return res.json()
}

async function logUserIn(e) {
    e.preventDefault()
    let user = getLoginData()
    let res = await sendData(user, "api/usuarios/login")
    console.log(res)
}

formL.addEventListener("submit", logUserIn)