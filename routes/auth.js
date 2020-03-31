const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/users');

// to login a user
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user)
        return res.status(404).send(`User doesn't exists`);
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
        return res.status(400).send('Invalid credentials');
    const token = user.generateToken();
    res.status(200).send(token);
})

module.exports = router;