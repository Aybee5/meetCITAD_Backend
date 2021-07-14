let { EventInfos } = require("../Models/meetCITADModel")
let path = require('path')
let fs = require('fs')

//Post Event
exports.createEvent = (req, res) => {
    // if (!req.file) {
    //     return res.json({
    //         message: "Please provide the event Image!"
    //     })
    // }
    let eventInfo = {
        title: req.body.title,
        description: req.body.description,
        venue: req.body.venue,
        hostBy: req.body.hostBy,
        date: req.body.date,
        time: req.body.time,
        eventImage: req.file.path
    }
    EventInfos.create(eventInfo)
        .then(event => {
            res.json(event) 
        })
        .catch(err => {
            res.status(403).json({error: `Sorry cannot save event ${err}`})
        })
}

//Get all Created Event
exports.getEvents = (req, res) => {
    EventInfos.find().then(events => {
        res.json(events)
    })
    .catch(err => {
        res.status(403).json({
            error: `Cannot create the event due to ${err}`
        })
    })
}

//Get Single Event via Id
exports.getSingleEvent = (req, res) => {
    let id = req.params.eventID
    EventInfos.findById({_id: id})
        .then(event => {
            res.json(event)
        })
        .catch(err => {
            res.status(403).json({msg: `Something is wrong while getting this event ${err}`})
        })
}

//Update Single event by editing it
exports.editEvent = (req, res) => {
    let getId = req.params.eventID

    EventInfos.findByIdAndUpdate({_id: getId}, req.body)
    .then(() => res.json( {message: `Event Edited successfully.`}))
    .catch(err => {
        res.status(403).json({
            error: `We have an error while editing this event ${err}`
        })
    })
}

//Delete an Event
exports.deleteEvent = (req, res) => {
    let getId = req.params.eventID

    EventInfos.findByIdAndRemove({_id: getId})
    .then (result => {
        let image = result.eventImage
           deleteImage(image)
            res.json({
                msg: "Event deleted Successfully!"
            })
        }).catch (err => {
            res.json({
                msg: `Cannot delete this event ${err}`
            })
        })
}

//Function to delete images that their event info was deleted
let deleteImage = (filePath) => {
    let FilePath = path.join(__dirname, '../', filePath)
    fs.unlink(FilePath).then(() => console.log("Deleted")).catch(() => console.log("Error"))
}