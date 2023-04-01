// required packages
const express = require("express")
const methodOverride = require("method-override")
// app config
const app = express()
const PORT = 8000
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false}))

// middleware
app.use(methodOverride("_method"))

// routes
// GET / -- index show route for the app
app.get("/", (req, res) => {
    res.render("index.ejs")
})

// controllers
app.use("/dinosaurs", require("./controllers/dinosaurs"))
app.use("/prehistoric_creatures", require("./controllers/prehistoric_creatures"))


// listen on aport
app.listen(PORT, () => {
    console.log(`is that RESTful dinos I hear on port ${PORT} 🦕?`)
})