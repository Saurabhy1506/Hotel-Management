import  jwt from "jsonwebtoken";

const authenticateAdmin = (req,res,next)=>{
const token = req.cookies.token;
if(!token){
    return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
}
try{
    const decode = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decode;
    if(decode.Role === 'admin'){
        next()
    }
    else{
    return res.status(403).json({ success: false, message: "Forbidden: Only admin can access this" });
    }

}catch(error){
    console.log("An error occured during authentication", error);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
}
}

const verifyToken = (req,res,next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(403).json({ message: 'Token is required' });
    }
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decode)=>{
        if(err){
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.userId = decode.id;
        next();
    })
}
export {authenticateAdmin, verifyToken}