const express = require('express')
const fs = require('fs')

const router = express.Router()

const readCreatures = () => {
    // read in the creatures json
    const creatures = fs.readFileSync("./prehistoric_creatures.json")
    // convert to POJO
    const creatureData = JSON.parse(creatures)
    return creatureData
}

// GET /prehistoric_creatures -- READ all creatures
router.get('/', (req, res) => {
    const creatures = readCreatures()
    res.render('prehistoric_creatures/index.ejs', {
        creatures
    })
})

// GET /prehistoric_creatures/new -- SHOW form to CREATE creature
router.get('/new', (req, res) => {
    res.render("prehistoric_creatures/new.ejs")
})

// POST /prehistoric_creatures -- intake form data from /new and CREATE creature
router.post('/', (req, res) => {
    console.log(req.body)
    const creatures = readCreatures()
    creatures.push(req.body)
    fs.writeFileSync("./prehistoric_creatures.json", JSON.stringify(creatures))
    res.redirect('/prehistoric_creatures')
})

// GET /prehistoric_creatuers/:id -- READ creature @ :id
router.get('/:id', (req, res) => {
    const creatures = readCreatures()
    
    res.render("prehistoric_creatures/details.ejs", {
        creature: creatures[req.params.id],
        id: req.params.id
    })
})

// GET /prehistoric_creatures/edit/:id -- GET the edit form
router.get('/edit/:id', (req, res) => {
	const creatures = readCreatures()
    res.render('prehistoric_creatures/edit.ejs', {
        creature: creatures[req.params.id],
        id: req.params.id
    })
})

// PUT /prehistoric_creatures/:id -- PUT/PATCH new info from edit form to creature
router.put('/:id', (req,res) => {
    const creatures = readCreatures()

    // change name and type property of chosen creature to values from edit form
    creatures[req.params.id].type = req.body.type
    creatures[req.params.id].img_url = req.body.img_url

    // save edited creature
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(creatures))
    
    // redirect back to creature index
    res.redirect('/prehistoric_creatures')
})

// DELETE /prehistoric_creatures/:id -- DELETE a single creature @ :id
router.delete('/:id', (req, res) => {
    const creatures = readCreatures()

    // remove deleted creature from creature.json
    creatures.splice(req.params.id, 1)

    // save new creature file
    fs.writeFileSync('./prehistoric_creatures.json', JSON.stringify(creatures))

    // redirect to index route AKA GET /prehistoric_creatures
    res.redirect('/prehistoric_creatures')
})
module.exports = router