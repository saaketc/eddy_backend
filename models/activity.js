const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
        title: String,
        image: String,
        content: {
            instructions: String,
            story: String,
            parts: [{ title: String, content: String }]
        },
        materials: String,
        characters: String,
        description: { type: String, required: true }
    
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;