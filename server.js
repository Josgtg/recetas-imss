const dotenv = require("dotenv").config()
const path = require("path")

const express = require("express")
const app = express()

const passport = require("passport")
const passportLocal = require("passport-local")
const LocalStrategy = passportLocal.Strategy
const session = require("express-session")
const errorHandler = require("./middleware/errorHandler")

const connectDb = require("./dbConnection")


connectDb()

app.set("view engine", "ejs")

app.set("views", path.join(__dirname, "views"))

app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"))

app.use(session({
    name: "imssSessionId",
    secret: process.env.SECRET,
    cookie: { _expires: (2 * 60 * 60 * 1000) }, // 2 horas
    resave: false,
    saveUninitialized: false
}))

app.use("/api", require("./routes/apiRoutes"))

app.use("/", require("./routes/viewRoutes"))

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log("Server is up and running")
})