import jwt from 'jsonwebtoken';

const verifyAdmin = (req,res, next)=>{
  const token = req.cookies.token;
  if(!token){
    return res.status(403).json({ message: 'Token is required' });
  }
  jwt.verify(token, process.env.PRIVATE_KEY,(err, decode)=>{
    if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.log(decode.Role);
      if (decode.Role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      next();
  })
}
export {verifyAdmin}