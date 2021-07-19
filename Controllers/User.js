let { UserDetails, Suggestion, EventInfos } = require("../Models/meetCITADModel");
let bcrypt = require('bcryptjs');
let crypto = require('crypto');
let jwt = require('jsonwebtoken')
let transporter = require("../Middleware/mailer");

//User Sign in authentication
exports.userSignin = (req, res) => {
    let username = req.body.username
    let password = req.body.password

    UserDetails.findOne({username: username})
        .then(user => {
            let validPassword = bcrypt.compareSync(password, user.password)

            if (user && validPassword){
                let token = jwt.sign({user: user}, process.env.JWT_KEY, {expiresIn: "1h"})
                
                return res.status(200).json({
                    message: "SignIn Successfully",
                    User: user,
                    userToken: token,
                    login: true
                })
            } else {
                res.status(409).json({
                    error: "Username or Password is incorrect"
                })
            }
            
        })
        .catch(() => res.status(500).json({
            message: "Username does't exist. Please check and comfirm it!!!"
        }))
}

//Create user
exports.createUser = (req, res) => {
    let username = req.body.username
    if (username) {
      UserDetails.findOne({username: username})
        .then(user => {
            if (user && username === user.username) {
                return res.status(409).json({error: "Username already exist"})
            }
            else {
                let userInfo = {
                    fullname: req.body.fullname,
                    username: req.body.username,
                    email: req.body.email,
                    organisation: req.body.organisation,
                    password: bcrypt.hashSync(req.body.password, 10),
                    gender: req.body.gender
                }
                UserDetails.create(userInfo)
                    .then(result => {
                        res.status(201).json({result, message: "User created Successfully"})
                    })
                    .catch(error => res.status(500).json({error: `Cannot Save User`}))
            }
        })
    
    }else {
      let userAttend = {
        username: Date.now().toString(32),
        fullname: req.body.fullname,
        email: req.body.email,
        organisation: req.body.organisation,
        gender: req.body.gender,
        phone: req.body.phone
      }
        UserDetails.create(userAttend)
        .then(result => {
            res.status(201).json({result, message: "User created Successfully"})
        })
        .catch(error => res.status(500).json({error: `Cannot Save User`}))
    }
  }
          

//Get all Users
exports.usersList = (req, res) => {
    UserDetails.find()
        .then(users => {
            res.status(200).json({
                Users: users
            })
        })
        .catch(err => res.status(500).json({
            error: "Error while getting Users"
        }))
}

//Get a single User
exports.getUser = (req, res) => {
    let username = req.params.username
    UserDetails.findOne({username})
        
        .then(user => {
            res.status(200).json({
                User: user
            })
        }).catch(err => res.status(500).json({error: "Cannot find the user"}))
}

//Update a single User
exports.updateUser = (req, res) => {
    let username = req.params.username
    let userInfoUpdate;
    
    if(!req.file) {
       userInfoUpdate = {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.telephone,
            organisation: req.body.organisation,
            biography: req.body.biography,
            gender: req.body.gender,
            profileImage: ''
        }
    }        
    else if(req.file){
       userInfoUpdate = {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            organisation: req.body.organisation,
            biography: req.body.biography,
            gender: req.body.gender,
            profileImage: req.file.path
        }     
    }
    
    UserDetails.findOneAndUpdate({username: username}, userInfoUpdate, { new: true })
        .then((updatedInfo) => {
            res.status(201).json({updatedInfo, message: "Event Updated Successfully"})       
        })
        .catch(error => res.status(500).json({error: `Cannot update the record`})
        )
}

//Change Password
exports.changePassword = (req, res) => {
    let currentPassword = req.body.password
    let newPassword = req.body.newPassword
    let hashPassword = bcrypt.hashSync(newPassword, 10) //Encrypt the new Password

    UserDetails.findOne({username: req.params.username})
        .then(user => {
        let validPassword = bcrypt.compareSync(currentPassword, user.password)

        if (user && validPassword) {
            UserDetails.updateOne({username: req.params.username}, {password: hashPassword})
                
                .then(result => {
                    res.status(201).json({message: "Password successfully changed"})
                }).catch(err => res.status(500).json({error: "Cannot change password"}))
            }
        else {
            return res.status(409).json({error: "Please check the current password"})
        }
    })
    .catch(err=>{
        res.status(500).json({error: "Cannot find the User"})
    })
}

//Post Reset Password
exports.resetPassword = (req, res) => {
    let email = req.body.email
    
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return console.log(err)
        }
        let token = buffer.toString('hex')
        UserDetails.findOne({email: email}).then(user => {
            if (!user) {
                return res.status(404).json({error: "No User with such email."})
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000
            return user.save()
        })
        .then(response => {
            transporter.sendMail({
                to: email,
                from: process.env.USERNAME,
                subject: "Password Reset",
                html: `
                    <div style="align: center">
                        <h3>Reset your password?</h3>
                        <p>If you requested a password reset, use the link below to complete the process. 
                        If you didn't make this request, ignore this email.</p>
                        <p> <a href="http://localhost:8080/reset-password/${token}"> Set new Password </a> </p>

                        <p> <center>Thank you!!!</center> </p>
                    </div>
                `
            }, (err, res) => {
                if(err) {
                    console.log({error: "Email not Send", err})
                }else {
                    console.log({message: "Email send Successfully"});
                }
            })
            console.log(response);
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
    })
}

//Post New Password
exports.setNewPassword = (req, res) => {
    let passwordToken = req.params.token
    UserDetails.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}})
    .then(resetUser => {
        if (!resetUser) {
            res.status(404).json({error: "Cannot find this user"})
        }
        let newPassword = req.body.password
        let hashPassword = bcrypt.hashSync(newPassword, 10)

        resetUser.password = hashPassword
        resetUser.resetToken = undefined
        resetUser.resetTokenExpiration = undefined

        return resetUser.save()
    })
    .then(res => {
        res.status(201).json({respons: res, message: "Password Changed"})
    })
    .catch(err => {
        res.status(500).json({error: "Error while resetting password"})
    })
}

//Post Registered Events
exports.registeredEvents = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId
    
    UserDetails.findById({_id: userId}).then(user => {
        let email = user.email

        //Check whether there is registered event of user
        if (user.registeredEvent !== [] && user.registeredEvent.findIndex(ev => ev == eventID) >= 0){
            return res.status(409).json({error: "You already registered this event"})
        }else {
            user.registeredEvent.push({_id: eventID})
            user.attendance = false
            user.save()
            .then(result => {
            EventInfos.findById({_id: eventID}).then(eventData => {
                let eventDetail = {
                    title: eventData.title,
                    description: eventData.description,
                    location: eventData.venue,
                    date: eventData.date.toDateString()
                }
                //Sending Sucessful registration to user email
                transporter.sendMail({
                    to: email,
                    from: process.env.USERNAME,
                    subject: "Registration Status",
                    html: `
                        <h3>You Successfully Registered for CITAD's Event </h3>
                        <p>Which is ${eventDetail.title}: ${eventDetail.description} that will
                            take place at ${eventDetail.location} on ${eventDetail.date.toString()}
                        </p>

                        <p>Thank You, We really appreciated and your attendance really matters.</p>
                    `
                }, (err, res) => {
                    if(err) {
                        console.log({error: "Email not Send"})
                    }else {
                        console.log({message: "Email send Successfully"});
                    }
                })
                }).catch(err => {
                    res.status(500).json(() => {error: "Cannot find the event"})
                })
            })
        }
    }).catch(err => res.status(500).json({error: "No such User with this Id"}))
}

//UnRegistered Events
exports.unRegisteredEvents = (req, res) => {
    let eventID = req.params.eventID
    let userId = req.body.userId

    UserDetails.findById({_id: userId}).then(user => {
        let registeredEvents = user.registeredEvent
        if (registeredEvents == [] && registeredEvents.findIndex(ev => ev == eventID) < 0) {
            return res.status(409).json({error: "No Registered event"})
        }
        if (user.registeredEvent.findIndex(ev => ev == eventID) >= 0){
            user.attendance = false
        }else {
            user.attendance = undefined
        }
        registeredEvents.splice(registeredEvents.findIndex(event => {
            event === eventID
        }), 1)
        return user.save()
        .then(() => res.status(201).json({
            message: "Successfully Unregistered"
        })).catch(err => {
            res.status(409).json({error: "Cannot Unregister the event"})
        })
    }).catch(err => res.status(500).json({error: "No such User with this Id"}))
}

//Get Registered Events
exports.getRegisteredEvents = (req, res) => {
    
    UserDetails.findOne({_id: req.query.userId})
    .select("registeredEvent")
    .populate("registeredEvent", "title description venue time")    
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => res.status(500).json({error: `error while getting registered event`}))
}


//Post Suggestion Message
exports.createSuggestion = (req, res) => {
    UserDetails.findOne({_id: req.body.userId})
    .then(user => {
        if(user){
            let suggestions = {
                email: req.body.email,
                comment: req.body.comment,
                date: new Date()
            }

            Suggestion.create(suggestions)
            .then(resultmessage => {
                user.suggestionMessage.push(resultmessage)
                user.save()
                res.status(201).json({message: "Suggestions sent"})
            })
            .catch(err => res.status(409).json({error: `Cannot send Suggestion`}))
        }
        else {
            res.status(500).json({error: "No User with such id here"})
        }
    }).catch(err => res.status(500).json({erro: "Cannot find the User"}))
    
}

//Get Suggestion Message
exports.getSuggestion = (req, res) => {
    
    UserDetails.findOne({_id: req.query.userId}).select('suggestionMessage').populate("suggestionMessage")
    .then(suggestion => {
        res.status(200).json(suggestion)
    })
    .catch(err => res.status(500).json({error: 'error while getting sent messages'}))
}


