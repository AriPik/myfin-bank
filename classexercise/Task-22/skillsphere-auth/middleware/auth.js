function ensureAuthenticated(req,res,next){

    if(req.isAuthenticated()){
        return next()
    }

    res.send("Access Denied")
}

function ensureAdmin(req,res,next){

    if(req.user && req.user.role === "admin"){
        return next()
    }

    res.send("Access Denied")
}

module.exports = {ensureAuthenticated,ensureAdmin}