// implement your posts router here
const express = require('express');

const router = express.Router();

const posts = require('./posts-model');

// 1	GET	/api/posts	Returns an array of all the post objects contained in the database

router.get('/', async (req, res) => {
    try {
        const data = await posts.find();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({
            message: 'The posts information could not be retrieved',
            error: err.message
        });
    }
});

// 2	GET	/api/posts/:id	Returns the post object with the specified id

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await posts.findById(id);
        if (!data) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            });
        }
        else {
            res.json(data);
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'The post information could not be retrieved',
            error: err.message
        });
    }
});

// 3	POST	/api/posts	Creates a post using the information sent inside the request body and returns the newly created post object

router.post('/', async (req, res) => {
    try {
        const { body } = req;
        if (!body.title || !body.contents) {
            res.status(400).json({
                message: 'Please provide title and contents for the post'
            });
        }
        else {
            const { id } = await posts.insert(body);
            const created = await posts.findById(id);
            res.status(201).json(created);
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'There was an error while saving the post to the database',
            error: err.message
        });
    }
});

// 4	PUT	/api/posts/:id	Updates the post with the specified id using data from the request body and returns the modified document, not the original

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    try {
        if (!body.title || !body.contents) {
            return res.status(400).json({
                message: 'Please provide title and contents for the post'
            });
        }
        const data = await posts.update(id, body);
        if (!data) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            });
        }
        else {
            const updated = await posts.findById(id);
            res.status(200).json(updated);
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'The post information could not be modified',
            error: err.message
        });
    }
});

// 5	DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await posts.findById(id);
        const data = await posts.remove(id);
        if (!data) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            });
        }
        else {
            res.json(deleted);
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'The post could not be removed',
            error: err.message
        });
    }
});

// 6	GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await posts.findPostComments(id);
        if (data.length === 0) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            });
        }
        else {
            res.json(data);
        }
    }
    catch (err) {
        res.status(500).json({
            message: 'The comments information could not be retrieved',
            error: err.message
        });
    }
});

module.exports = router;
