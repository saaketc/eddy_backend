const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
   question: { type: String, required: true }, 
    answers: [{
        // _id: false ,
        ansUserId: { type: mongoose.Schema.Types.ObjectId, },
        author: String,
        answer: { type: String },
    }],
    userId: { type: mongoose.Schema.Types.ObjectId },
    author: String
});

const Question = mongoose.model('Question', questionSchema);
module.exports.Question = Question;