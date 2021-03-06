const router = require('express').Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const { Course } = require('../models/course');
const { User } = require('../models/users');

// to add a chapter in a topic
router.post('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let course = await Course.findById(id);

        if (!course)
            return res.status(404).send("Course not found");
        course.modules.push(req.body);
        await course.save();
        return res.status(201).send(course);
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
})

// to add a course with chapter // need to implement admin login to add content
router.post('/', async (req, res) => {
    try {
        let course = new Course(_.pick(req.body, ['title', 'description', 'skills', 'transformation', 'modules']));
        const imagePath = req.file.filename;
        course.image = imagePath;
        await course.save();
        res.status(201).send(course);
        
        }
    catch (ex) {
        res.status(500).send(ex.message);
    }
})
// to get all topics in dashboard
router.get('/', async (req, res) => {
    try {
        const topics = await Course.find({});
        res.status(200).send(topics);
    }
    catch (ex) {
        res.status(500).send('Something went wrong');
    }
})

// // to get a particular topic throught topic name
// router.get('/:topic/:title', async (req, res) => {
//     const topicTitle = req.params.topic
//     const title = req.params.title
//     res.status(200).send({ topicTitle, title });
//     // try {
//     //     let topic = await Course.find({ title: topicTitle });
//     //     if (!topic)
//     //         return res.status(404).send('Topic not found');
//     //     res.status(200).send(topic);
//     // }
//     // catch (e) {
//     //     res.status(500).send('Something went wrong');
//     // }
// })

// to store quiz score
router.post('/quiz/:id', auth, async (req, res) => {
    try {
        const courseId = req.params.id;
        let user = await User.findById(req.user._id);
        for (let course of user.enrolledCourses) {
            if (course.courseId === courseId) {
                course.score += (0.7 * req.body.quizScore);
                break;
            }
        }
        await user.save();
        return res.status(200).send(user);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
})

// To store parental feedback score
router.post('/parental/:id', auth, async (req, res) => {
    try {
        const courseId = req.params.id;
        let user = await User.findById(req.user._id);
        for (let course of user.enrolledCourses) {
            if (course.courseId === courseId) {
                course.score += (0.3 * req.body.parentalScore);
                break;
            }
        }
        await user.save();
        return res.status(200).send(user);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
})
// to get a particular chapter of topic
router.get('/:title', async (req, res) => {
    const topicTitle = req.params.title;
   
    try {
        let topic = await Course.findOne({ title:topicTitle });
        if (!topic)
            return res.status(404).send('Topic not found');
        res.status(200).send(topic);
    }
    catch (e) {
        res.status(500).send('Something went wrong');
    }
})

module.exports = router;