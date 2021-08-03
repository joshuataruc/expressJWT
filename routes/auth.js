const router = require('express').Router();
const User = require('../model/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    // validation for the new user using @hapi/joi
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if email exist
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email Already Exist');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // creating an email
    const user = new User({
    name : req.body.name, 
    email : req.body.email,
    password : hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send('saved!');
    }catch(err){
        res.status(400).json({message: err});
    }
});

router.post('/login', async (req, res)=>{
    // validation for the new user using @hapi/joi
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if email exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid Email');

    // check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password');

    res.send('Logged In!');


});


module.exports = router;
