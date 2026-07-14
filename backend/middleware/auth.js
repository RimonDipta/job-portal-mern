import jwt from 'jsonwebtoken';

export const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    
    // Check Authorization header as fallback
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Access Denied. User not authenticated.",
        success: false
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token verification.",
        success: false
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.error(`Auth Middleware error: ${error.message}`);
    return res.status(401).json({
      message: "Unauthorized request. Session expired.",
      success: false
    });
  }
};
