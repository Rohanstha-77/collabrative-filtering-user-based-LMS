import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

    const token =  req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false,message: "No token" });

    jwt.verify(token, process.env.JWT_SECRECT_KEY,(err, decoded) => {
    if (err) return res.status(401).json({ success: false,message: "Invalid token" });
    req.user = decoded;
    next();
    });

};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};
