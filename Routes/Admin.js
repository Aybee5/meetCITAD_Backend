const express = require('express')

const AdminController = require('../Controllers/Admin')

const router = express.Router()

router.post('/signup', AdminController.adminCreate)

//authenticate event list /user/events
router.post('/login', AdminController.adminLogin)

//retrive all suggestions
router.get('/suggestions', AdminController.getSuggestion)

//push a registered users of a single event into the array via Id
router.post('/registered-users/:eventId', AdminController.registeredUsers)

//get all registered users of that event
router.get('/registered-users/:eventId', AdminController.getRegisteredUsers)

//push an attended users of a single event into the array via Id
router.post('/attended-users/:eventId', AdminController.attendedUsers)

//push a not attended users of a single event into the array via Id
router.post('/notattended-users/:eventId', AdminController.notAttendedUsers)

//get all attended users of that single event
router.get('/attended-users/:eventId', AdminController.getAttendedUsers)


module.exports = router;