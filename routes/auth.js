const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register',  async (req, res) => {

    // validate user input
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // checking if the user is already exist by email check
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create n save new user
    const user = new User(
        {
            nama: req.body.nama,
            tempat_lahir: req.body.tempat_lahir,
            tgl_lahir: req.body.tgl_lahir,
            gender: req.body.gender,
            alamat: req.body.alamat,
            email: req.body.email,
            password: hashedPassword,
            ulang_password: hashedPassword,
            hp: req.body.hp,
            pekerjaan: req.body.pekerjaan
        }
    );
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

//user login
router.post('/login', async (req, res) => {
    //validate data passed by user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //checking if the email exists
    const user = await User.findOne( {email: req.body.email});
    if (!user) return res.status(400).send('Email is not found.');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('invalid password');

    //create and assign a token
    const token = jwt.sign( { _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(`copy this token to header: ${token}`);

    res.send('Success Logged in!')
});

module.exports = router;