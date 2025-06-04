import jwt from 'jsonwebtoken';

// const verifyToken = (token, secret) => {
//   return jwt.verify(token, secret);
// };

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
//   console.log(req.headers.authorization)

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

    const token =  req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false,message: "No token" });
    // console.log(typeof(token))
    // console.log(token)
//   console.log(process.env.JWT_SECRECT_KEY)


//   const tokenVer = jwt.verify(token,process.env.JWT_SECRECT_KEY)
//   console.log(tokenVer)
    // console.log("secrect",typeof(process.env.JWT_SECRECT_KEY))
    // console.log(process.env.JWT_SECRECT_KEY)


    jwt.verify(token, process.env.JWT_SECRECT_KEY,(err, decoded) => {
    if (err) return res.status(401).json({ success: false,message: "Invalid token" });
    req.user = decoded;
    // console.log(req.user)
    next();
    });

};
