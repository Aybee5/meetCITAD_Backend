//Middleware Built in declaration
let express = require('express')
let mongoose = require('mongoose')
let cors = require('cors')
require('dotenv').config()

//Routes Folders injected via Index file
let EventRoute = require('./Routes/Events')
let AdminRoute = require('./Routes/Admin')
let UserRoute = require('./Routes/User')

//Middleware of the Backend
let app = express();
app.use(express.json())
app.use('/Uploads',express.static('Uploads'))
app.use(express.urlencoded({ extended: true }))
app.use(cors());

//Header Declarations
app.use((req, res, next) => {
    res.setHeader('Acess-Control-Allow-Origin', '*')
    res.setHeader('Acess-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Acess-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With')
    next()
})

//Middleware Routes
app.use('/event', EventRoute)
app.use('/user', UserRoute)
app.use('/admin', AdminRoute)

//Connecting to MongoDataBase
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to the database!")
  })
  .catch(err => {
    console.log("Cannot connect to the database! " + err)
    process.exit()
  });

mongoose.Promise = global.Promise;

//Handling 404 Error Page not found
app.use((req, res) => {
  res.status(404).send({ url: `404 Error ${req.originalUrl} not found please cross-check the url address` });
});

//Server Port Connection
let PORT = process.env.PORT || 3030;
app.listen(PORT, ()=>{
  console.log("Listening to port " + PORT)
})
