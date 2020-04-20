const router = require('express').Router();
const Activity = require('../models/activity');
const _ = require('lodash');

// To create an activity
router.post('/', async (req, res) => {
    try {
        let activity = new Activity(_.pick(req.body, ['title', 'image', 'materials', 'characters', 'description']));
        activity.image = req.file.filename;
        activity = await activity.save();
        res.status(201).send(activity);
    }
    catch (e) {
        res.status(500).send(e.message);

    }
});

// to add an activity 
router.post('/add/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let activity = await Activity.findById(id);

        if (!activity)
            return res.status(404).send("Activity not found");
        activity.content = req.body.content;
        await activity.save();
        return res.status(201).send(activity);
    }
    catch (ex) {
        res.status(500).send(ex.message);
    }
})
// to fetch activities
router.get('/', async (req, res) => {
    try {
        let activities = await Activity.find({});
        res.status(200).send(activities);
    }
    catch (e) {
        res.status(500).send(e.message);

    }

});

// to get a specific activity
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let activity = await Activity.findById(id);
        res.status(200).send(activity);
    }
    catch (e) {
        res.status(500).send(e.message);

    }

});

module.exports = router;