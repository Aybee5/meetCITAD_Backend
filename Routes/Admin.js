const express = require('express')

const AdminController = require('../Controllers/Admin')
const checkAuth = require('../Middleware/Authentication')

const router = express.Router()

router.post('/signup', AdminController.adminCreate)

//authenticate event list /user/events
router.post('/login', AdminController.adminLogin)

//retrive all suggestions
router.get('/suggestions', checkAuth, AdminController.getSuggestion)

//push a registered users of a single event into the array via Id
router.post('/registered-users/:eventId', checkAuth, AdminController.registeredUsers)

//get all registered users of that event
router.get('/registered-users/:eventId', checkAuth, AdminController.getRegisteredUsers)

//push an attended users of a single event into the array via Id
router.post('/attended-users/:eventId', checkAuth, AdminController.attendedUsers)

//push a not attended users of a single event into the array via Id
router.post('/notattended-users/:eventId', checkAuth, AdminController.notAttendedUsers)

//get all attended users of that single event
router.get('/attended-users/:eventId', checkAuth, AdminController.getAttendedUsers)


module.exports = router;