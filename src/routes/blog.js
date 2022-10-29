const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blog');
const auth = require('../middlewares/auth');
const multer = require("multer");

const imageUpload = multer({
    limits: {
        fileSize: 1e12,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(png|bmp|jpe?g)$/i)) {
            return cb(new Error("file must be image format"));
        }
        cb(null, true);
    },
});

router.get('/', async (req, res) => {
    const {page, limit, filter, name} = req.query;
    try {
        const result = await blogController.getBlogs(page, limit, filter, name);
        res.status(200).send({message: "success", result});
    } catch (error) {
        res.status(400).send({message: "failure", error});
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await blogController.getBlog(id);
        res.status(200).send({message: "success", result});
    } catch (error) {
        res.status(400).send({message: "failure", error});
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { page } = req.query;
    try {
        const result = await blogController.getCommentsBlog(id, page);
        res.status(200).send({message: "success", result});
    } catch (error) {
        res.status(400).send({message: "failure", error});
    }
})

router.post('/', imageUpload.single('thumbnail'), (req, res) => {
    try {
        const result = blogController.createBlog({
            name: req.body.name,
            description: req.body.description,
            content: req.body.content,
            thumbnail: {
                name: req.file.originalname,
                data: req.file.buffer
            }
        });
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.patch('/', imageUpload.single('thumbnail'), (req, res) => {
    try {
        const result = blogController.updateBlog({
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            content: req.body.content,
            thumbnail: req.file ? {
                name: req.file?.originalname,
                data: req.file?.buffer
            } : null
        });
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.patch('/like/:id', auth, async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user._id;
    try {
        const result = await blogController.likeBlog(userId, blogId); 
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.patch('/dislike/:id', auth, async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user._id;
    try {
        const result = await blogController.dislikeBlog(userId, blogId); 
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.patch('/comment/:id', auth, async (req, res) => {
    const blogId = req.params.id;
    const user = req.user;
    const { comment } = req.body;
    console.log(req.body);
    console.log(comment);
    try {
        const result = await blogController.commentBlog(user, blogId, comment);
        res.status(201).send({message: "success", result});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

router.delete('/:id', (req, res) => {
    try {
        const id = req.params.id;
        blogController.deleteBlog(id);
        res.status(201).send({message: "success", result: {id}});
    } catch (error) {
        res.status(401).send({message: "failure", error});
    }
})

module.exports = router;