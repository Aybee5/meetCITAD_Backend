let express = require('express');

let { eventUpload } = require('../Storage/Storage')
let EventController = require('../Controllers/Events')
let checkAuth = require('../Middleware/Authentication')

let router = express.Router()

//create an event
router.post('/events', checkAuth, eventUpload,EventController.createEvent)

//retrieve event list /user/events
router.get('/events', checkAuth, EventController.getEvents)

//retrieve a single event via Id
router.get('/events/:eventID', checkAuth, EventController.getSingleEvent)

//Edit an event
router.patch('/events/:eventID', checkAuth, EventController.editEvent)

//delete an event
router.delete('/events/:eventID', checkAuth, EventController.deleteEvent)


module.exports = router;