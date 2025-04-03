const adminMiddleware = (req, res, next) => {
    // auth middleware should run before this middleware
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    
    next();
  };
  
  module.exports = adminMiddleware;