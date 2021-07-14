let mongoose = require('mongoose')
let Schema = mongoose.Schema

//Events Model
EventsSchema = Schema(
    {
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
            ref: 'UserInformation'
        }
        ],
        attendedUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'UserInformation'
        }]
    }, 
    {
        timestamps: true
    }
)

//Admin Model
let AdminSignSchema = Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }, 
    {
        timestamps: true
    }
)

//User Model
let UserInfoSchema = Schema(
    {
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
        attendance: Boolean,
        registeredEvent: [{
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }],
        
        suggestionMessage: [{
            type: Schema.Types.ObjectId,
            ref: 'Suggestion'
        }],
        resetToken: String,
        resetTokenExpiration: Date
    }, 
    {
        timestamps: true
    }
)

//User's Suggestion
let SuggestionsSchema = Schema(
    {
        email: String,
        comment: String,
        date: Date
    }, 
    {
        timestamps: true
    }
)

let UserDetails =  mongoose.model("UserInformation", UserInfoSchema)
let Suggestion = mongoose.model("Suggestion", SuggestionsSchema)
let EventInfos = mongoose.model("Event", EventsSchema)
let AdminSign = mongoose.model("Admininstration", AdminSignSchema)


module.exports = {
    UserDetails,
    Suggestion,
    EventInfos,
    AdminSign
}