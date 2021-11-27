//Configuring maailjet for sending mails to users
let mailjet = require ('node-mailjet')
.connect(
  process.env.MJ_APIKEY_PUBLIC, 
  process.env.MJ_APIKEY_PRIVATE
)

let transporter = mailjet.post("send", {'version': 'v3.1'})

module.exports = transporter