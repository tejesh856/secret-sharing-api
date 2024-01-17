const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Secrets = require('../Models/Secrets');
const moment = require('moment');
router.post('/postsecret',
  [
    body('message', 'Secret must not be empty').trim().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    await Secrets.create({
        message: req.body.message,
        createdAt: Date.now()

    }).then(() => { res.send({ success: true }); }).catch((error) => {
        console.log(error);
        res.send({ success: false });
    })
  });
  router.get('/getmessages', async (req, res) => {
    try {
      const messages = await Secrets.find().sort({ createdAt: -1 });

    // Format createdAt field using Moment.js
    const formattedMessages = messages.map((msg) => ({
      _id: msg._id,
      message: msg.message,
      createdAt: moment(msg.createdAt).fromNow(),
    }));

    res.json({ success: true, messages: formattedMessages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
module.exports = router;