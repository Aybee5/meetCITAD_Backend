let { AdminSign, EventInfos, Suggestion } = require("../Models/meetCITADModel")
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')

//Admin Sign In details
exports.adminCreate = (req, res) => {
    AdminSign.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }).then(result => {
        res.json(result)
    }).catch(err => res.json(err))
}

//Admin authentication Sign in
exports.adminLogin = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    console.log(req.expireToken);
    AdminSign.findOne({email: email})
        .then(admin => {
            let validPassword = bcrypt.compareSync(password, admin.password) //password encryption
            if (validPassword && email == admin.email){
                let token = jwt.sign(
                    { adminInfo: admin }, 
                    process.env.JWT_KEY, 
                    {expiresIn: "1h"}) //Generating a token
                    
                return res.json({
                    message: "Authentication Successfully",
                    Admin: admin,
                    adminToken: token
                })
            }else{
                return res.status(404).json({
                    msg: "email or password is incorrect"
                })
            }
        }).catch(err => res.status(404).json(err))
}


//Get all Suggestion Messages
exports.getSuggestion = (req, res) => {
    Suggestion.find()
        .then(response => {
            res.json(response)
        })
        .catch(err => res.status(404).json({msg: `Error While getting the suggestions message ${err}`}))
}

//Post Registered Users of an Event
exports.registeredUsers = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId

    EventInfos.findById({_id: eventID}).then(event => {
        if (event.registeredUsers !== [] && event.registeredUsers.findIndex(x => x == userId) >= 0){
            return res.json({msg: "You already a Registered User of this event"})
        }
        event.registeredUsers.push({_id: userId})
        event.save()
        .then(res.json({
            msg: "Success",
            register: event.registeredUsers
        })).catch(err => console.log(err))
    }).catch(err => res.status(404).json({error: `${err}`}))
}

//Get all Registered Users of an Event
exports.getRegisteredUsers = (req, res) => {
    EventInfos.findOne({_id: req.params.eventID}).select("registeredUsers title description eventImage").populate("registeredUsers", "fullname email organisation phone gender attendance")
        .then(event => {
            res.status(200).json(event)
        })
        .catch(err => console.log('error while getting registered Users'))
}

//Post Attended Users of an Event
exports.attendedUsers = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId
    
    EventInfos.findById({_id: eventID}).then(event => {
        if (event.attendedUsers !== [] && event.attendedUsers.findIndex(x => x == userId) >= 0){
            return res.json({msg: "You are already an Attendee of this event"})
        }else {
            event.attendedUsers.push(userId)
            event.save()
            res.json({
                attend: event.attendedUsers
            })
        }
    }).catch(err => res.json({error: err}))
}

//Remove Not Attended Users
exports.notAttendedUsers = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId

    EventInfos.findById({_id: eventID}).then(event => {
        let attendedUser = event.attendedUsers
        attendedUser.splice(attendedUser.findIndex(user => {
            user === userId
        }), 1)
        event.save()
        .then(res.json({
            message: "Success"
        }))
    }).catch(err => res.json({error: `${err}`}))
}

//Get Attended Users of an Event
exports.getAttendedUsers = (req, res) => {
    EventInfos.findOne({_id: req.params.eventID}).select("title attendedUsers").populate("attendedUsers", "fullname email organisation phone gender")
        .then(event => {
            res.status(200).json(event)
        })
        .catch(err => console.log('error while getting attended Users ' + err))
}
