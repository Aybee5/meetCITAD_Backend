const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Events Model
EventsSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    hostBy: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    eventImage: {
        type: String,
        required: true
    },
    registeredUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'UserInformation',
        unique: false,
        attendance: {
            type: Boolean,
            default: false
        }
    }
    ],
    attendedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'UserInformation'
    }]
})

//Admin Model
const AdminSignSchema = Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

//User Model
const UserInfoSchema = Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    address: String,
    phone: String,
    organisation: String,
    biography: String,
    profileImg: String,
    gender: String,

    registeredEvent: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    
    suggestionMessage: [{
        type: Schema.Types.ObjectId,
        ref: 'Suggestion'
    }]
})

//User's Suggestion
const SuggestionsSchema = Schema({
    email: String,
    comment: String
})

const UserDetails =  mongoose.model("UserInformation", UserInfoSchema)
const Suggestion = mongoose.model("Suggestion", SuggestionsSchema)
const EventInfos = mongoose.model("Event", EventsSchema)
const AdminSign = mongoose.model("Admininstration", AdminSignSchema)


module.exports = {
    UserDetails,
    Suggestion,
    EventInfos,
    AdminSign
}