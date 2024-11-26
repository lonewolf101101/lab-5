const loggerMiddleware = (req, res, next) => {
    const currentTime = new Date().toISOString();
    console.log(`[${currentTime}] ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route handler
  };
  
module.exports = loggerMiddleware;
  