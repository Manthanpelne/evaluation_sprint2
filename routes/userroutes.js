const express = require("express")
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {userModel} = require("../models/usermodel")
const {authenticate}=require("../middlewares/authenticate")
const {authorize} = require("../middlewares/authorize")
const fs = require("fs")


userRouter.post("/signup",async(req,res)=>{
    const {name,email,pass,role} = req.body
    try {
        bcrypt.hash(pass,5,async(err,hash)=>{
            const user = new userModel({
                name:name,
                email:email,
                pass:hash,
                role
            })
            await user.save()
            res.send("Signup successfull")
        })
    } catch (error) {
        console.log(error)
    }
})



userRouter.post("/login",async(req,res)=>{
    const {email,pass} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user){
            res.send("user not found. signup first")
            return
        }
        const hashpass = user?.pass
        bcrypt.compare(pass,hashpass,(err,result)=>{
         if(result){
            const token = jwt.sign({userId:user._id, role:user.role},process.env.secretkey,{expiresIn:"1m"})
            const refreshtoken = jwt.sign({userId:user._id, role:user.role},process.env.refreshkey,{expiresIn:"5m"})
            res.send({"msg":"login successfull",token,refreshtoken})
         }
         else{
            res.send("Wrong credentials..try again")
         }
        })

    } catch (error) {
        console.log(error)
    }
})


userRouter.get("/getnewtoken",(req,res)=>{
    const reftoken = req.headers.authorization
    try {
        if(!reftoken){
            res.send("Login first")
            return
        }
        jwt.verify(reftoken,process.env.refreshkey,(err,decoded)=>{
            if(err){
                res.send({"msg":"login again","err":err.message})
                return
            }else{
                console.log(decoded.role)
                const token = jwt.sign({userId:decoded.userId,role:decoded.role},process.env.secretkey,{expiresIn:"1d"})
                res.send({"msg":"login successfull",token})
            }
        })
    } catch (error) {
        console.log(error)
    }
})


userRouter.post("/logout",(req,res)=>{
const token = req.headers.authorization
try {
    const blacklistdata = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklistdata.push(token)
    fs.writeFileSync("./blacklist.json",JSON.stringify(blacklistdata))
    res.send("logout successfull")
} catch (error) {
    console.log(error)
}
})



userRouter.get("/products",authenticate,authorize("customer,seller"),(req,res)=>{
    res.send("products")
})

userRouter.post("/addproducts",authenticate,authorize("seller"),(req,res)=>{
    res.send("add products")
})

userRouter.delete("/deleteproducts",authenticate,authorize("seller"),(req,res)=>{
    res.send("delete products")
})



module.exports = {userRouter}