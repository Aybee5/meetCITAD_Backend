const { AdminSign, EventInfos, Suggestion } = require("../Models/meetCITADModel")
const bcrypt = require('bcryptjs')
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
    const email = req.body.email
    const password = req.body.password

    AdminSign.findOne({email: email})
        .then(admin => {
            const validPassword = bcrypt.compareSync(password, admin.password)
            
            if (admin && validPassword) {
                return res.json({msg: "Login Succesfully"})
            }
            else{
                return res.json({
                    msg: "email or password is incorrect"
                })
            }
        }).catch(err => res.json(err))
}


//Get all Suggestion Messages
exports.getSuggestion = (req, res) => {
    Suggestion.find()
        .then(response => {
            res.json(response)
        })
        .catch(err => res.json({msg: `Error While getting the suggestions message ${err}`}))
}

//Post Registered Users of an Event
exports.registeredUsers = (req, res) => {
    const eventId = req.params.eventId
    const userId = req.body.userId

    EventInfos.findById({_id: eventId}).then(event => {
        event.registeredUsers.push({_id: userId})
        event.save()
        .then(res.json({
            msg: "Success",
            register: event.registeredUsers
        })).catch(err => console.log(err))
    }).catch(err => res.json({error: `${err}`}))
}

//Get all Registered Users of an Event
exports.getRegisteredUsers = (req, res) => {
    EventInfos.findOne({_id: req.params.eventId}).select("registeredUsers title description").populate("registeredUsers", "fullname email organisation phone gender attendance")
        .then(event => {
            res.status(203).json(event)
        })
        .catch(err => console.log('error while getting registered Users'))
}

//Post Attended Users of an Event
exports.attendedUsers = (req, res) => {
    const eventId = req.params.eventId
    const userId = req.body.userId

    EventInfos.findById({_id: eventId}).then(event => {
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
    const eventId = req.params.eventId
    const userId = req.body.userId

    EventInfos.findById({_id: eventId}).then(event => {
        const attendedUser = event.attendedUsers
        attendedUser.splice(attendedUser.findIndex(user => {
            user === userId
        }), 1)
        event.save()
        .then(res.json({
            msg: "Success"
        }))
    }).catch(err => res.json({error: `${err}`}))
}

//Get Attended Users of an Event
exports.getAttendedUsers = (req, res) => {
    EventInfos.findOne({_id: req.params.eventId}).select("title attendedUsers").populate("attendedUsers", "fullname email organisation phone gender")
        .then(event => {
            res.status(203).json(event)
        })
        .catch(err => console.log('error while getting attende Users'))
}
