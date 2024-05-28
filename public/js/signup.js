var formS = document.getElementById("signup-form")

function getSignupData() {
    return Object.fromEntries(new FormData(formS).entries())
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

async function signUserUp(e) {
    e.preventDefault()
    let user = getSignupData()
    let res = await sendData(user, "api/usuarios/signup")
    console.log(res)
}

formS.addEventListener("submit", signUserUp)