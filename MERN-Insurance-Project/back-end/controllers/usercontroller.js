// controllers/userController.js
const Employee = require('../models/Employee.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const sendEmail = require('./email.js');


const createInsUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password } = req.body
  
    if (!name || !email || !phone || !password) {
      res.status(400)
      throw new Error('Please add all fields')
    }
  
    // Checking if user exists
    const userExists = await Employee.findOne({ name })
  
    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
  
    // Creating user

    const newEmployee = new Employee({
        name,
        email,
        phone,
        password: hashedPassword
    });


    await newEmployee.save()
        .then(() => res.json('User Registered Successfully!'), async () => {const emailSubject = `Welcome to InsuPort, ${name}`;
        const emailBody = `Hello ${name},\n\nYour account with us has been successfully created. Keep Saving. \n\n -InsuPort`;
        await sendEmail(email, emailSubject, emailBody);})
        .catch(err => res.status(400).json(
            { message: 'Username not found. Please Register before trying to login'}));
});

const loginUser = asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    const user = await Employee.findOne({ name });
    if (!user) {
        return res.status(400).json({ message: 'Username not found. Please Register before trying to login'});
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword){
        return res.status(400).json({ message: 'Wrong Credentials. Try Again.'});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d' });
    return res.json({token, userId: user._id});
});


const verifytoken = asyncHandler(async (req, res, next) => {
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

module.exports = {
    createInsUser,
     loginUser,
    verifytoken}