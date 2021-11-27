let express = require('express')

let AdminController = require('../Controllers/Admin')
let checkAuth = require('../Middleware/Authentication')

let router = express.Router()

router.post('/signup', AdminController.adminCreate)

//authenticate Admin list /user/events
router.post('/login', AdminController.adminLogin)

//retrive all suggestions
router.get('/suggestions', checkAuth, AdminController.getSuggestion)

//push a registered users of a single event into the array via Id
router.post('/registered-users/:eventID', checkAuth, AdminController.registeredUsers)

//pop a registered users of a single event into the array via Id
router.post('/unregistered-users/:eventID', checkAuth, AdminController.unRegisteredUsers)

//get all registered users of that event
router.get('/registered-users/:eventID', checkAuth, AdminController.getRegisteredUsers)

//push an attended users of a single event into the array via Id
router.post('/attended-users/:eventID', checkAuth, AdminController.attendedUsers)

//push a not attended users of a single event into the array via Id
router.post('/notattended-users/:eventID', checkAuth, AdminController.notAttendedUsers)

//get all attended users of that single event
router.get('/attended-users/:eventID', checkAuth, AdminController.getAttendedUsers)

//Send Event Reminder
router.post('/reminder/:eventID', checkAuth, AdminController.sendReminders)

//Reply Suggestions
router.post('/reply-message', checkAuth, AdminController.replySuggestions)


module.exports = router;