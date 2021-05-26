const express = require('express');
const { eventUpload } = require('../Storage/Storage')

const EventController = require('../Controllers/Events')

const router = express.Router()

//create an event
router.post('/events', eventUpload,EventController.createEvent)

//retrieve event list /user/events
router.get('/events', EventController.getEvents)

//retrieve a single event via Id
router.get('/events/:eventId', EventController.getSingleEvent)

//Edit an event
router.patch('/events/:eventId', EventController.editEvent)

//delete an event
router.delete('/events/:eventId', EventController.deleteEvent)


module.exports = router;