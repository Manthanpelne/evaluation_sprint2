const authorize = (role)=>{
    return (req,res,next)=>{
        const userrole = req.body.userrole
        if(role.includes(userrole)){
            next()
        }else{
            res.send("Not authorized..!!")
        }
    }
}

module.exports = {authorize}