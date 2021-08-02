let { EventInfos } = require("../Models/meetCITADModel")
let path = require('path')
let fs = require('fs')

//Post Event
exports.createEvent = (req, res) => {
    if (!req.file) {
        return res.status(409).json({
            error: "Please provide the event Image!"
        })
    }
    let eventInfo = {
        title: req.body.title,
        description: req.body.description,
        venue: req.body.venue,
        hostBy: req.body.hostBy,
        date: req.body.date,
        time: req.body.time,
        availableSeat: req.body.availableSeat,
        eventImage: req.file.path
    }
    EventInfos.create(eventInfo)
        .then(event => {
            res.status(201).json({event, message: "Event created Successfully"}) 
        })
        .catch(err => {
            res.status(500).json({error: `Sorry cannot save event`})
        })
}

//Get all Created Event
exports.getEvents = (req, res) => {
    EventInfos.find().then(events => {
        res.status(200).json({
            Events: events,
            tokenExpiration: req.expireToken
        })
    })
    .catch(err => {
        res.status(500).json({
            error: `Cannot get the events`
        })
    })
}

//Get Single Event via Id
exports.getSingleEvent = (req, res) => {
    let id = req.params.eventID
    EventInfos.findById({_id: id})
        .then(event => {
            res.status(200).json(event)
        })
        .catch(err => {
            res.status(500).json({error: `Something is wrong while getting this event`})
        })
}

//Update Single event by editing it
exports.editEvent = (req, res) => {
    let getId = req.params.eventID
   
    EventInfos.findByIdAndUpdate({_id: getId}, req.body, {new: true})
    .then(() => res.status(201).json( {
        message: `Event Edited successfully.`
    }))
    .catch(err => {
        res.status(500).json({
            error: `We have an error while editing this event`
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
        res.status(201).json({
            message: "Event deleted Successfully!"
        })
        })
    .catch (err => {
        res.status(500).json({
            error: `Cannot delete this event ${err}`
        })
    })
}

//Function to delete images that their event info was deleted
let deleteImage = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err)
        }
    })
}