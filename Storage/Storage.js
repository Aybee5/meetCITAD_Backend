const multer = require('multer');
const path = require('path')
 
const storageEvent = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads/Events/');
    },
    filename: (req, file, cb) => {
        cb(null, `eventImage-${new Date().toISOString()}` + path.extname(file.originalname));
    }
})
 
const storageUser = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads/ProfilePictures/')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.username + path.extname(file.originalname));
    }
})

const fileFilter = (req, file,cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    }else {
        cb(new Error("Sorry the file you send is not an Image!"), false)
    }
}

const eventUpload = multer({ storage: storageEvent, fileFilter: fileFilter }).single('eventImage')

const userUpload = multer({ storage: storageUser, fileFilter: fileFilter }).single('profileImage')

module.exports  = {
    eventUpload,
    userUpload
};