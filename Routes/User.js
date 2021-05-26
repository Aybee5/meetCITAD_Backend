const express = require('express')

const UserProfileController = require('../Controllers/User')
const { userUpload } = require('../Storage/Storage')

const router = express.Router()

//User AUthentication
router.post('/login', UserProfileController.userSignin)

//Create User
router.post('/created-users', UserProfileController.createUser)

//Get All Users
router.get('/created-users', UserProfileController.usersList)

//Get single User by username
router.get('/created-users' + '/:username', UserProfileController.getUser)

//Update a User by username as Id
router.patch('/created-users' + '/:username', userUpload,UserProfileController.updateUser)

//Update User's password
router.patch(('/created-users' + '/:username' + '/change-password'), UserProfileController.changePassword)

//Push Registered event to a User
router.post('/registered-event/:eventId', UserProfileController.registeredEvents)

//Push UnRegistered event to a User
router.post('/unregistered-event/:eventId', UserProfileController.unRegisteredEvents)

//Get All Registered events for a User
router.get('/registered-event', UserProfileController.getRegisteredEvents)

//Create Suggestion Message
router.post('/suggestions', UserProfileController.createSuggestion)

//Get Suggestion Message
router.get('/suggestions', UserProfileController.getSuggestion)


module.exports = router;