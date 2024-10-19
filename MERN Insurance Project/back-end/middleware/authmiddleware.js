const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const Employee = require('../models/Employee.js');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
    if (authHeader) {
        // Verify token
        jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
            if(err){
                return res.sendStatus(403);
            }
            next();
        });
    }
    else{
        return res.sendStatus(401);
      }
})

module.exports = { protect }