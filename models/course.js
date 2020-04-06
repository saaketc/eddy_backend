const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    title: { type: String, required: true, maxlength: 100 },
    description: String,
    skills: [{ type: String }],
    transformation: [{ type: String }],
    image: String, 
    modules: [
        {
            title: { type: String, required: true, maxlength: 100 },
            activityContent: [
            { title: String,

            content:{
                instructions: String,
                story: String,
                parts:[{title: String, content: String}]
            }, 
            materials:String, 
            characters: String }],
            description: { type: String, required: true },
            purpose: { type: String, required: true },
            evaluation: { observational: [String], questions: [String] },
            quiz: [{ question: String, options: [{ value: String, weight: Number }] }],
            maxQuizScore: { type: Number },
            maxParentalScore: { type: Number },

        }
    ]
});

const Course = mongoose.model('Course', courseSchema);
module.exports.Course = Course;