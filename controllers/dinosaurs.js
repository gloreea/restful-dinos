const express = require("express")
const fs = require("fs")
const router = express.Router()

//mount all of our routes on the router

const readDinos = () => {
    // use the filesystem to read the dino json
    const dinosaurs = fs.readFileSync("./dinosaurs.json")
    //console.log(dinosaurs)
    
    // parse the raw json to js
    const dinoData = JSON.parse(dinosaurs)
    //console.log(dinoData)
    
    // return the dino data
    return dinoData

}

// GET /dinosaurs -- return an array of dinosaurs
router.get("/", (req, res) => {
    let dinos = readDinos()
    console.log(req.query)

    // if the user has searched, filter the dino array
    if(req.query.dinoFilter) {
        dinos = dinos.filter(dino => {
            // compare lowercase strings for case insensitivity
            console.log(dino)
            return dino.name.toLowerCase().includes(req.query.dinoFilter.toLowerCase())
        })
    }

    res.render("dinos/index.ejs", {
    // equal to { dinos: dinos}
    dinos
    })
})

// GET /dinosaurs/new -- show route for a form that posts to POST /dinosaurs
router.get("/new", (req, res) => {
    res.render("dinos/new.ejs")
})
// POST /dinosaurs -- CREATE a new dino in the db
router.post("/", (req, res) => {
    console.log(req.body) // POST form data shows up in the req.body
    const dinos = readDinos()
    // push the dino from the req.body into the array json dinos
    dinos.push(req.body)
    // write the json file to save to disk
    fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinos))
    // tell the browser to redirect
    // do another GET request on a sepecific url
    res.redirect("/dinosaurs")
})

// GET /dinosaurs/:id -- READ a single dino @ :id
router.get("/:id", (req, res) => {
    // read the dino json data
    const dinos = readDinos()
    // lookup one dino using the req.params
    const foundDino = dinos[req.params.id]
    // render the details template
    res.render("dinos/details.ejs", {
        dino: foundDino,
        id: req.params.id
    })
})

// GET /dinosaurs/edit/:id -- GET the edit form

router.get("/edit/:id", (req, res) => {
    let dinosaurs = fs.readFileSync("./dinosaurs.json")
    let dinoData = JSON.parse(dinosaurs)
    res.render("dinos/edit", {
        dino: dinoData[req.params.id],
        id: req.params.id
    })
})

// PUT /dinosaurs/:id -- PUT/PATCH new info from edit form to dino

router.put("/:id", (req, res) => {
    let dinosaurs = fs.readFileSync("./dinosaurs.json")
    let dinoData = JSON.parse(dinosaurs)

    // change name and type property of chosen dino to values from edit form
    dinoData[req.params.id].name = req.body.name
    dinoData[req.params.id].type = req.body.type

    // save edited dino
    fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinoData))

    // redirect back to dino index:
    res.redirect("/dinosaurs")
})


// DELETE /dinosaurs/:id -- DELETE
router.delete("/:id", (req, res) => {
    let dinosaurs = fs.readFileSync("./dinosaurs.json")
    let dinoData = JSON.parse(dinosaurs)

    // remove deleted dino from dino.JSON
    dinoData.splice(req.params.id, 1)


    fs.writeFileSync("./dinosaurs.json", JSON.stringify(dinoData))
    // redirect to index route AKA GET /dinosaurs
    res.redirect("/dinosaurs")
})


module.exports = router