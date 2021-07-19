let { AdminSign, EventInfos, Suggestion } = require("../Models/meetCITADModel")
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')

//Admin Sign In details
exports.adminCreate = (req, res) => {
    AdminSign.create({
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    }).then(result => {
        res.status(200).json(result)
    }).catch(err => res.status(500).json({
        error: "Sorry, Cannot Create this account"
    }))
}

//Admin authentication Sign in
exports.adminLogin = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    
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
                return res.status(409).json({
                    error: "email or password is incorrect"
                })
            }
        }).catch(err => res.status(500).json({error: "User email doest not exist"}))
}


//Get all Suggestion Messages
exports.getSuggestion = (req, res) => {
    Suggestion.find()
        .then(response => {
            res.status(200).json(response)
        })
        .catch(err => res.status(500).json({msg: `Error While getting the suggestions message ${err}`}))
}

//Post Registered Users of an Event
exports.registeredUsers = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId

    EventInfos.findById({_id: eventID}).then(event => {
        if (event.registeredUsers !== [] && event.registeredUsers.findIndex(x => x == userId) >= 0){
            return res.status(409).json({msg: "You already a Registered User of this event"})
        }
        if (event.registeredUsers.length >= 0 && event.registeredUsers.length < event.availableSeat ) {
            event.registeredUsers.push({_id: userId})
            event.save()
            .then(res.status(201).json({
                message: "Successfully Registered",
                register: event.registeredUsers
            })).catch(err => res.status(500).json({error: "Cannot Registered the User"}))            
        }else {
            res.status(409).json("Sorry, No more Available seat for this Events")
        }

    }).catch(err => res.status(500).json({error: "Cannot find this event"}))
}

//UnRegistered Events
exports.unRegisteredUsers = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId

    EventInfos.findById({_id: eventID}).then(event => {
        let registeredUser = event.registeredUsers
        registeredUser.splice(registeredUser.findIndex(user => {
            user === userId
        }), 1)
        event.save()
        .then(res.status(201).json({
            message: "Successfully Unregistered"
        })).catch(err => res.status(409).json({error: "Cannot Unregister the User"}))
    }).catch(err => res.status(500).json({error: "Cannot find this event"}))
}

//Get all Registered Users of an Event
exports.getRegisteredUsers = (req, res) => {
    EventInfos.findOne({_id: req.params.eventID})
        .select("registeredUsers title description eventImage")
        .populate("registeredUsers", "fullname email organisation phone gender attendance")
        .then(event => {
            res.status(200).json(event)
        })
        .catch(err => res.status(500).json({error: 'error while getting registered Users'}))
}

//Post Attended Users of an Event
exports.attendedUsers = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId
    
    EventInfos.findById({_id: eventID}).then(event => {
        if (event.attendedUsers !== [] && event.attendedUsers.findIndex(x => x == userId) >= 0){
            return res.status(409).json({error: "You are already an Attendee of this event"})
        }else {
            event.attendedUsers.push(userId)
            event.save()
            res.status(201).json({
                message: "Attendee added Successfully",
                attend: event.attendedUsers
            })
        }
    }).catch(err => res.status(500).json({error: "Cannot find this event"}))
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
        .then(res.status(201).json({
            message: "Attendee removed Successfully"
        }))
    }).catch(err => res.status(500).json({error: "Cannot find this event"}))
}

//Get Attended Users of an Event
exports.getAttendedUsers = (req, res) => {
    EventInfos.findOne({_id: req.params.eventID}).select("title attendedUsers").populate("attendedUsers", "fullname email organisation phone gender")
        .then(event => {
            res.status(200).json(event)
        })
        .catch(err => res.status(500).json({error: 'error while getting attended Users '}))
}

//Send Reminders
exports.sendReminders = (req, res) => {
    EventInfos.findById({_id: req.params.eventID})
        .select('title description venue date time registeredUsers')
        .populate('registeredUsers', 'email')
        .then(eventData => {
            let eventDetail = {
                title: eventData.title,
                description: eventData.description,
                location: eventData.venue,
                time: eventData.time,
                date: eventData.date.toDateString()
            }
            let userMail = eventData.registeredUsers
            let mails = userMail.map(ele => ele.email)
            
            // Sending Reminder to the users email
            transporter.sendMail({
                to: mails,
                from: process.env.USERNAME,
                subject: "Reminder",
                html: `
                    <h3>REMINDER for CITAD's Event </h3>
                    <p>The event you registered recently with the details of ${eventDetail.title}: ${eventDetail.description} will
                        eventually take place at ${eventDetail.location} on ${eventDetail.date.toString()}
                    </p>

                    <p>Thank You, We really appreciate and your attendance really matters.</p>
                `
            }, (err, cb) => {
                if(err) {
                    console.log({error: "Email not Send"})
                }else {
                    console.log({message: "Email send Successfully"});
                }
            })
        })
        .catch(error => {
            res.status(500).json({ error: "Cannot find this event" })
        })
}

exports.replySuggestions = (req, res) => {
    let mailto = req.body.email
    let message = req.body.reply

    transporter.sendMail({
        to: mailto,
        from: process.env.USERNAME,
        subject: "Reply",
        html: `
            <h3>meetCITAD</h3>
            <p>${message}</p>

            <p>Thank You, We really appreciate.</p>
        `
    }, (err, cb) => {
        if(err) {
            console.log({error: "Email not Send"})
        }else {
            console.log({message: "Email send Successfully"});
        }
    })
}