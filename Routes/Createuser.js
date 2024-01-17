const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secrettoken='mynameistejeshreddypursuingbcainmanipaluniversityaiminingtobecomefullstackdevelopers';
router.post('/createuser',
[
    body('email', 'Invalid Email').isEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be greater than 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('username', 'Username less than 5 characters').isLength({ min: 5 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const salt=await bcrypt.genSalt(10);
        let secpassword=await bcrypt.hash(req.body.password,salt);
        const existingUser = await user.findOne({
            email: req.body.email
        });
        if (existingUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists please login' }] });
        }
        await user.create({
            username: req.body.username,
            password: secpassword,
            email: req.body.email,

        }).then(() => { res.send({ success: true }); }).catch((error) => {
            console.log(error);
            res.send({ success: false });
        })
    })


router.post('/loginuser',
[
    body('email', 'Invalid Email').isEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be greater than 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success:false, errors: errors.array() });
        }
        await user.findOne({
            email: req.body.email,
        }).then(async (data)=>{
            if (!data) {
                return res.status(400).send({ success:false,errors: [{msg:'try logging with correct email'}] });
            }
            let cmpassword=await bcrypt.compare(req.body.password,data.password)
            if (!cmpassword) {
                return res.status(400).send({ success:false,errors: [{msg:'try logging with correct password'}]});
            }
            const used={
                user:{
                    id:data.id
                }
            }
            const authtoken=jwt.sign(used,secrettoken);
            return res.send({ success: true,authtoken:authtoken});
            
        }).catch((error) => {
            console.log(error);
            res.send({ success: false });
        })
    })
    // Createuser.js

module.exports = router;