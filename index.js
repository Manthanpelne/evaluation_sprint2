const express = require("express")
const app = express()
const {connection} = require("./db")
require("dotenv").config()
const {userRouter} = require("./routes/userroutes")

app.use(express.json())

app.use("/user",userRouter)


app.listen(process.env.port,async()=>{
    await connection
    console.log(`running server at ${process.env.port}`)
})