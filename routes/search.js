const router = require('express').Router();
const { Question } = require('../models/questions');

router.get('/:query', async (req, res) => {
    try {
        const query = req.params.query;
        let results = [];
        if (query === '')
            return res.send(results);
        
        results = await Question.find({ question: new RegExp('.*' + query + '.*') });
        if (results.length === 0)
            return res.status(404).send('Not found');
        res.status(200).send(results);
    }
    catch (e) {
        res.status(500).send(e.message);
    }
});

module.exports = router;