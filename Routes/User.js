let express = require('express')

let UserProfileController = require('../Controllers/User')
let { userUpload } = require('../Storage/Storage')
let checkAuth = require('../Middleware/Authentication')

let router = express.Router()

//User AUthentication
router.post('/login', UserProfileController.userSignin)

//Create User
router.post('/created-users', UserProfileController.createUser)

//Get All Users
router.get('/created-users', checkAuth, UserProfileController.usersList)

//Get single User by username
router.get('/created-users' + '/:username', checkAuth, UserProfileController.getUser)

//Update a User by username as Id
router.patch('/created-users' + '/:username', checkAuth, userUpload, UserProfileController.updateUser)

//Update User's password
router.patch(('/created-users' + '/:username' + '/change-password'), checkAuth, UserProfileController.changePassword)

//Post Reset Password
router.post('/reset-pswd', UserProfileController.resetPassword)

//Post New Password
router.post('/reset-pswd/:token', UserProfileController.setNewPassword)

//Push Registered event to a User
router.post('/registered-event/:eventID', checkAuth, UserProfileController.registeredEvents)

//Push UnRegistered event to a User
router.post('/unregistered-event/:eventID', checkAuth, UserProfileController.unRegisteredEvents)

//Get All Registered events for a User
router.get('/registered-event', checkAuth, UserProfileController.getRegisteredEvents)

//Create Suggestion Message
router.post('/suggestions', checkAuth, UserProfileController.createSuggestion)

//Get Suggestion Message
router.get('/suggestions', checkAuth, UserProfileController.getSuggestion)


module.exports = router;