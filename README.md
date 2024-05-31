# Módulo de control de recetas para derechohabientes del IMSS Bienestar

Este es el proyecto final de la materia *Introducción al Desarrollo de Aplicaciones Web*. Esta es una aplicación que tiene el propósito de proporcionar facilidad para el registro de recetas y su seguimiento por parte de los médicos para pacientes derechohabientes del sistema de salud.

### Prerrequisitos:

- Node JS
- MongoDB Server / MongoDB Atlas


## Para ejecutarlo localmente:

Necesitarás tener la herramienta Git en tu computadora para seguir este proceso.

1. Iniciar un repositorio de git vacío en una carpeta nueva donde se vaya a guardar el proyecto.

```git init```

```git branch -M main```

2. Para vincular con el repositorio local:

```git remote add origin https://github.com/Josgtg/recetas_imss```

3. Para descargar los archivos del repositorio:

```git pull origin main```

4. Ya debes ser capaz de instalar las dependencias necesarias:

```npm install```

5. Necesitas crear un archivo con el nombre *.env* dentro de la carpeta principal. Dentro de este archivo debe venir la siguiente estructura:

PORT = *Número de puerto al que va a escuchar la aplicación*

CONNECTION_STRING = *Link a tu base de datos de MongoDB (Entre comillas)*

SECRET = *Palabra o frase de tu preferencia. Es una clave necesaria para la funcionalidad de las cookies (Entre comillas)*

6. Habiendo hecho lo anterior, deberías poder iniciar la aplicación:

```npm run dev``` - Para usar nodemon

o

```npm run```

Si el comando se ha ejecutado de forma exitosa, podrás ver la aplicación en ejecución en la dirección<br>htt<span>p://localhost:</span>*El puerto que escribiste en tu archivo.env*<br>
*htt<span>p://localhost:</span>9030, por ejemplo.*

# Uso de la API

Todas las peticiones y respuestas se manejan en formato JSON.

El api se compone de las siguientes url:

- /api/usuarios
- /api/recetas
- /api/medicinas

### Métodos y subrutas para /api/usuarios

- (Admin) GET /<br>Regresa una lista de todos los usuarios registrados.
- (Público) GET /*id*<br>Regresa al usuario con el id especificado de existir en la base de datos.
- (Público) GET /curp/*curp*<br>Regresa al usuario que tenga la curp especificada.
- (Público) POST /signup<br>Permite registrar a un usuario y registra una cookie con la sesión.<br>
Para registrar un usuario se necesitan los campos: curp, name, password y kind.
- (Público) POST /login<br>Registra una cookie con la sesión si los datos de inicio de sesión son correctos.<br>
Estos datos deben de ser: curp y password.
- (Público) PUT /*id*<br>Permite actualizar los datos del usuario con el id especificado.
- (Público) DELETE /*id*<br>Permite eliminar al usuario con el id especificado.

Los métodos PUT y DELETE sólo funcionan si el usuario a actualizar o eliminar es el mismo que el de la sesión activa, a menos de que quien haga la petición sea un administrador.

### Métodos y subrutas para /api/recetas

- (Admin) GET /, GET /*id*<br>Regresa todas las recetas.
- (Doctor) GET /, GET /*id*<br>Regresa todas las recetas que haya hecho ese doctor.
- (Paciente) GET /, GET /*id*<br>Regresa las recetas de ese paciente.
- (Doctor) POST /<br>Permite subir una receta.<br>
Para subir una receta son necesarios los campos: patient (La curp del usuario para el que se está escribiendo la receta), residence y medicine (Una lista con el id de las medicinas de la receta)
- (Doctor) PUT /*id*<br>Permite actualizar la receta con el id especificado.
- (Doctor) DELETE /*id*<br>Permite eliminar la receta con el id especificado.

### Métodos y subrutas para /api/medicinas

- (Público) GET /<br>Regresa una lista con todas las recetas.
- (Público) GET /*id*<br>Regresa el medicamento con el id especificado.
- (Admin) POST /<br>Permite subir una medicina.<br>
Para subir una medicina son necesarios los campos: name y description.
- (Admin) PUT /*id*<br>Permite actualizar los datos de la medicina con el id especificado.
- (Admin) DELETE /*id*<br>Permite eliminar la medicina con el id especificado.


## Ejemplo de cómo subir un usuario a la base de datos:
Ya sea desde el frontend, o directamente a la api, el proceso es parecido para las otras url.
Usaremos de ejemplo la api *fetch* de javaScript.
```
async function signUserIn() {
    let user = {
        curp: "MAAR790213HMNRLF03"
        name: "Rafael Márquez"
        password: "123456789"
        kind: "admin"
    }
    
    let request = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    }
    
    let response = await fetch("/api/usuarios/signup", request)
    
    return response.json()
}
```

El objeto que regrese esta función va a contener la respuesta de la api.

También es importante notar que todos los objetos o datos que se quieran enviar tienen que ir en el campo
*body* de la petición.