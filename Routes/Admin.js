let express = require('express')

let AdminController = require('../Controllers/Admin')
let checkAuth = require('../Middleware/Authentication')

let router = express.Router()

router.post('/signup', AdminController.adminCreate)

//authenticate event list /user/events
router.post('/login', AdminController.adminLogin)

//retrive all suggestions
router.get('/suggestions', checkAuth, AdminController.getSuggestion)

//push a registered users of a single event into the array via Id
router.post('/registered-users/:eventID', checkAuth, AdminController.registeredUsers)

//get all registered users of that event
router.get('/registered-users/:eventID', checkAuth, AdminController.getRegisteredUsers)

//push an attended users of a single event into the array via Id
router.post('/attended-users/:eventID', checkAuth, AdminController.attendedUsers)

//push a not attended users of a single event into the array via Id
router.post('/notattended-users/:eventID', checkAuth, AdminController.notAttendedUsers)

//get all attended users of that single event
router.get('/attended-users/:eventID', checkAuth, AdminController.getAttendedUsers)


module.exports = router;