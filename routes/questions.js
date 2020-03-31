const router = require('express').Router();
const _ = require('lodash');
const auth = require('../middleware/auth');
const { Question } = require('../models/questions');
const { User } = require('../models/users');



// to insert ans in a question

router.post('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let ques = await Question.findById(id);
        if (!ques)
            return res.status(404).send('Invalid question');
        let user = await User.findById(req.body.ansUserId);
        const author = `${user.firstName} ${user.lastName} `;
        req.body.author = author;
        ques.answers.unshift(req.body);
        ques.save();
        res.status(200).send(ques);
        // res.send(ques.answers)


    }
    catch (e) {
        return res.status(500).send('Something went wrong!');
    }
})
// need to implement user auth middleware
// catch blocks in user friendly way also
router.post('/', auth, async (req, res) => {
    try {
        let question = new Question(_.pick(req.body, ['question', 'answers', 'userId']));
        let user = await User.findById(req.body.userId);
        const author = `${user.firstName} ${user.lastName}`;
        question.author = author;
        await question.save();
        res.status(200).send(question);
    }
    catch (e) {
        return res.status(500).send(e.message);   
    }
})

// get request to get all questions
router.get('/', async (req, res) => {

    try {
        let questions = await Question.find({}).sort('-_id').select('-__v');
        if (!questions || questions.length === 0)
            return res.status(404).send('No questions found!');
        
        res.status(200).send(questions);
    }
    catch (e) {
        return res.status(500).send('Something went wrong!');
    }
})

// to get a particular ques
router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        let ques = await Question.findById(id);
        if (!ques) return res.status(404).send('Question not found');
        res.status(200).send(ques);
    }
    catch (e) {
        res.status(500).send('something went wrong');
    }
})


// // to get a particular ques
// router.get('/:title', auth, async (req, res) => {
//     const title = req.params.title;
//     try {
//         let ques = await Question.findOne({question : title});
//         if (!ques) return res.status(404).send('Question not found');
//         res.status(200).send(ques);
//     }
//     catch (e) {
//         res.status(500).send('something went wrong');
//     }
// })
module.exports = router;
// question: { type: String, required: true },
// answers: [{
//     ansUserId: { type: Schema.Types.ObjectId },
//     answer: String,
// }],
//     userId: { type: Schema.Types.ObjectId }
// });