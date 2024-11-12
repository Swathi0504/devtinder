const auth = (req,res,next)=>{
    const token = req.body?.token || "xyz";
    const isAuthorised = token === "xyz";
    if(!isAuthorised) {
        res.status(401).send("Unauthorised"); 
    }
    else {
        next();
    }
}

module.exports = {auth}