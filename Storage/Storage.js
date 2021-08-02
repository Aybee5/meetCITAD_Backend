let multer = require('multer');
let path = require('path')
 
let storageEvent = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads/Events/');
    },
    filename: (req, file, cb) => {
        console.log(req.body);
        cb(null, `eventImage-${new Date().toISOString()}` + path.extname(file.originalname));
    }
})
 
let storageUser = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads/ProfilePictures/')
    },
    filename: (req, file, cb) => {
        console.log(req.body);
        cb(null, `profileImage-${new Date().toISOString()}` + path.extname(file.originalname));
    }
})

let fileFilter = (req, file,cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    }else {
        cb(new Error("Sorry the file you send is not an Image!"), false)
    }
}

let eventUpload = multer({ storage: storageEvent, fileFilter: fileFilter }).single('eventImage')

let userUpload = multer({ storage: storageUser, fileFilter: fileFilter }).single('profileImage')

module.exports  = {
    eventUpload,
    userUpload
}