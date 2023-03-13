const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{type:String,default:"customer"}
})

const userModel = mongoose.model("user",userSchema)

module.exports = {userModel}