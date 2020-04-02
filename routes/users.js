const router = require('express').Router();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { User, validate } = require('../models/users');
const { Course } = require('../models/course');

router.post('/', async (req, res) => {
    try {
        // let user = new User(_.pick(req.body, ['email', 'password', 'profile.firstName', 'profile.lastName', 'profile.profession', 'profile.workplace' ]));
        // const { error } = validate(req.body);
        // if (error)
        //     return res.status(400).send(error.details[0].message);
        
        let user = await User.findOne({ email: req.body.email });
        if (user)
            return res.status(400).send('User already exists! Login in instead');
        
        user = new User(_.pick(req.body, ['email', 'password', 'firstName', 'lastName']));
        // password hashing
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        
        await user.save();
         
        const token = user.generateToken();
        res.header("x-auth-token", token)
            .header("access-control-expose-headers", "x-auth-token")

            // to whitelist this header in browser and to get that at client end
            .status(201).send(user);
       
    }
    catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }
   
})
// To fetch user profile
router.get('/profile', auth, async (req, res) => {
    try{
        const userId = req.user._id;
        let user = await User.findById(userId).select('-password -__v');
        let enrolled = [];

        for (let course of user.enrolledCourses){
            let c = await Course.findById(course.courseId);
            if (c) {
                enrolled.push(c);
            }
            else continue;
        }
        return res.status(200).send({user:user, enrolled:enrolled});
    }
     catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }

})

// To update user profile
router.put('/updateProfile', auth, (req, res) => {
    try{
        // const updatedUser = req.body;
          User.findByIdAndUpdate(req.user._id, req.body).then(async () => {
            let user = await User.findById(req.user._id).select('-password -__v');
            
            // res.header("x-auth-token", req.header("x-auth-token"))
            // .header("access-control-expose-headers", "x-auth-token").status(200).send(user);
              res.status(200).send(user);
         });
}
      catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }
})

// To enroll in a course
router.post('/enroll', auth, async (req, res) => {
  try{
    let user = await User.findById(req.user._id);
    
    for(let course of user.enrolledCourses){
        if(course.courseId === req.body.courseId)
            return res.status(400).send('Already enrolled');
      }
      let courseObj = {
          courseId: req.body.courseId
      }
      user.enrolledCourses.push(courseObj);
    await user.save();
    
    res.status(200).send(user.enrolledCourses);
  }
        catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }
})

// To fetch enrolled courses
router.get('/enrolledCourses', auth, async (req, res) => {
  try{
    let user = await User.findById(req.user._id);    
    res.status(200).send(user.enrolledCourses);
  }
        catch (e) {
        res.status(500).send(e.message);
        console.log(e);
    }
})
module.exports = router;