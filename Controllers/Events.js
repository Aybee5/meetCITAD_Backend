const { EventInfos } = require("../Models/meetCITADModel")

//Post Event
exports.createEvent = (req, res) => {
    const eventInfo = {
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
            res.json({error: `Sorry cannot save event ${err}`})
        })
}

//Get all Created Event
exports.getEvents = (req, res) => {
    EventInfos.find().then(events => {
        res.json(events)
    })
    .catch(err => {
        res.json({
            error: `Cannot create the event due to ${err}`
        })
    })
}

//Get Single Event via Id
exports.getSingleEvent = (req, res) => {
    let id = req.params.eventId
    EventInfos.findById({_id: id})
        .then(event => {
            res.json(event)
        })
        .catch(err => {
            res.json({msg: `Something is wrong while getting this event ${err}`})
        })
}

//Update Single event by editing it
exports.editEvent = (req, res) => {
    let getId = req.params.eventId

    EventInfos.findByIdAndUpdate({_id: getId},req.body)
    .then(() => res.json( {msg: "Event Edited successfully."}))
    .catch(err => {
        res.json({
            error: `We have an error while editing this event ${err}`
        })
    })
}

//Delete an Event
exports.deleteEvent = (req, res) => {
    let getId = req.params.eventId

    EventInfos.findByIdAndRemove({_id: getId})
    .then (result => {
            res.json({
                msg: "Event deleted Successfully!"
            })
        }).catch (err => {
            res.json({
                msg: `Cannot delete this event ${err}`
            })
        })
}
