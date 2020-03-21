const express = require('express')

const db = require('../data/helpers/actionModel')
const projectsDb = require('../data/helpers/projectModel')

const router = express.Router()

//GET ALL ACTIONS
router.get('/', (req, res) => {
    db.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "There was an error fetching all actions." })
        })
})

//GET ACTION BY ID
router.get('/:id', verifyActionId, (req, res) => {
    res.status(200).json(req.action)
})

//DELETE ACTION BY ID
router.delete('/:id', verifyActionId, (req, res) => {
    db.remove(req.params.id)
        .then(() => {
            res.status(200).json({ message: "Action successfully deleted" })
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "There was an error deleting this action." })
        })
})

//ADD ACTION
router.post('/', verifyAction, (req, res) => {
    db.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "There was an error creating the action." })
        })
})

//UPDATE ACTION
router.put('/:id', verifyAction, verifyActionId, (req, res) => {
    db.update(req.params.id, req.body)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(() => {
            res.status(500).json({ errorMessage: "There was an error updating this action." })
        })
})

//MIDDLEWARE

function verifyActionId (req, res, next) {
    db.get(req.params.id)
        .then(action => {
            if(!action) {
                res.status(400).json({ errorMessage: "There was not an action found with this id" })
            } else {
                req.action = action
                next();
            }
        })
}

function verifyAction (req, res, next) {
    if(!req.body) {
        res.status(400).json({ message: "missing action data" })
    } else if(!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(400).json({ message: "actions require a project id, description, and notes." })
    } else {
        projectsDb.get(req.params.project_id)
            .then(project => {
                if(project) {
                    next();
                } else {
                    res.status(400).json({ errorMessage: "Could not find a matching project." })
                }
            })
    }
}

module.exports = router;