const { UserDetails, Suggestion } = require("../Models/meetCITADModel");
const bcrypt = require('bcryptjs')

//User Sign in authentication
exports.userSignin = (req, res) => {
    const username = req.body.username
    const password = req.body.password

    UserDetails.findOne({username: username})
        .then(user => {
            const validPassword = bcrypt.compareSync(password, user.password)
            if (user && validPassword){
                return res.json(user)
            }
            res.json({mes: "error, wrong credentials"})
            })
        .catch(err => res.json(err))
}

//Create user
exports.createUser = (req, res) => {
    let username = req.body.username

    UserDetails.findOne({username: username})
        .then(user => {
            if (user && username === user.username) {
                return res.json({message: "Username already exist"})
            }
            else {
                const userInfo = {
                    fullname: req.body.fullname,
                    username: req.body.username,
                    email: req.body.email,
                    organisation: req.body.organisation,
                    password: bcrypt.hashSync(req.body.password, 10),
                    gender: req.body.gender
                }
                UserDetails.create(userInfo)
                    
                    .then(result => {
                        res.status(201).json(result)
                    })
                    .catch(error => res.status(202).json({message: `Data not created ${error}`}))
            }
        })
}

//Get all Users
exports.usersList = (req, res) => {
    UserDetails.find()
        
        .then(users => {
            res.json({
                Users: users
            })
        })
        .catch(err => res.json({
            error: err
        }))
}

//Get a single User
exports.getUser = (req, res) => {
    const username = req.params.username
    UserDetails.findOne({username})
        
        .then(user => {
            res.json(user)
        }).catch(err => res.json({message: "Cannot find the user"}))
}

//Update a single User
exports.updateUser = (req, res) => {
    const username = req.params.username

    const userInfoUpdate = {
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
    UserDetails.findOneAndUpdate({username: username}, userInfoUpdate, {new: true})
        .then(updatedinfo => {
            res.json(updatedinfo)
        })
        .catch(error => console.log(`Can't update the record ${error}`)
        )
}

//Change Password
exports.changePassword = (req, res) => {
    const currentpassword = req.body.crtpassword
    const newPassword = req.body.password
    const hashPassword = bcrypt.hashSync(newPassword, 10)

    UserDetails.findOne({username: req.params.username})
        .then(user => {
        const validPassword = bcrypt.compareSync(currentpassword, user.password)

        if (user && validPassword) {
            UserDetails.updateOne({username: req.params.username}, {password: hashPassword})
                
                .then(result => {
                    res.json({message: "Password successfully changed"})
                }).catch(err => res.json({message: `${err}`}))
            }
        else {
            return res.json({message: "Please check the current password"})
        }
    })
    .catch(err=>{
        res.status(500).json({error: `${err}`})
    })
}

//Post Reset Password
exports.resetPassword = (req, res) => {
    const email = req.body.email

}


//Post Registered Events
exports.registeredEvents =(req, res) => {
    const eventId = req.params.eventId
    const userId = req.body.userId

    UserDetails.findById({_id: userId}).then(user => {
        if (user.registeredEvent !== [] && user.registeredEvent.findIndex(ev => ev == eventId) >= 0){
            return res.json({message: "kham122You already registered this event"})
        }else {
            user.registeredEvent.push({_id: eventId})
            user.save().then(res.json({
                message: "Successfully Registered"
            }))
        }
    }).catch(err => res.json({error: `${err}`}))
}

//Delete Registered Events
exports.unRegisteredEvents = (req, res) => {
    const eventId = req.params.eventId
    const userId = req.body.userId

    UserDetails.findById({_id: userId}).then(user => {
        const registeredEvents = user.registeredEvent
        if (registeredEvents == [] && registeredEvents.findIndex(ev => ev == eventId) < 0) {
            return res.json({message: "No Registered event"})
        }
        registeredEvents.splice(registeredEvents.findIndex(event => {
            event === eventId
        }), 1)
        user.save()
        .then(() => res.json({
            message: "Successfully Unregistered"
        })).catch(err => {
            res.json({message: err})
        })
    }).catch(err => res.json({error: err}))
}

//Get Registered Events
exports.getRegisteredEvents = (req, res) => {
    UserDetails.findOne({_id: req.query.userId}).select("registeredEvent").populate("registeredEvent", "title description venue time")
        
        .then(user => {
            res.status(203).json(user)
        })
        .catch(err => res.json(`error while getting registered event ${err}`))
}


//Post Suggestion Message
exports.createSuggestion = (req, res) => {
    UserDetails.findOne({_id: req.body.userId})
    .then(user => {
        if(user){
            const suggestions = {
                email: req.body.email,
                comment: req.body.comment
            }

            Suggestion.create(suggestions)
            
            .then(resultmessage => {
                res.json(resultmessage),
                user.suggestionmessage.push(resultmessage)
                user.save()
            })
            .catch(err => res.json(`Cannot create ${err}`))
        }
        else {
            res.json({message: "No User with such id here"})
        }
    }).catch(err => console.error(err))
    
}

//Get Suggestion Message
exports.getSuggestion = (req, res) => {
    UserDetails.findOne({_id: req.query.userId}).populate("suggestionMessage")
    .then(user => {
        res.json({
            suggestion: user.suggestionMessage
        })
    })
    .catch(err => console.log('error while getting sent messages'))
}

