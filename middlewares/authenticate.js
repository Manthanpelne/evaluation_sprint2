const jwt = require('jsonwebtoken')
require("dotenv").config()
const fs = require("fs")

const authenticate = (req,res,next)=>{
    const token = req.headers.authorization
    
    if(!token){
        res.send("login failed")
        return
    }

    const blacklistdata = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    if(blacklistdata.includes(token)){
        return res.send("login again")
    }

    jwt.verify(token,process.env.secretkey,(err,decoded)=>{
        if(err){
         res.send({"msg":"login again",err:err.message})
         return
        }else{
            const userrole = decoded?.role
            req.body.userrole = userrole
            next() 
        }
    })
}

module.exports = {authenticate}