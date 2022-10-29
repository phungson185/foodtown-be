const Blog = require('../models/blog');
const util = require('../utils');

const getBlogs = async (page, limit, filter, name) => {
    try {
        const blogs = await Blog.find(name ? {name: { $regex: `${name.toUpperCase()}` }} : null).skip((page - 1) * limit).limit(limit).sort(filter ? {[filter]: -1} : {});
        return blogs;
    } catch (error) {
        console.log({error});
    }
}

const getBlog = async (id) => {
    try {
        const blog = await Blog.findById(id).populate('comments.user');
        const commentCount = blog?.comments?.length;
        if (blog?.comments?.length > 3) blog.comments = blog?.comments?.splice(0, 3);
        return {blog, commentCount};
    } catch (error) {
        console.log({error});
    }
}

const getCommentsBlog = async (id, page) => {
    console.log(id, page);
    try {
        const blog = await Blog.findById(id).populate('comments.user');
        // console.log(3 * parseInt(page));
        // console.log(3 * (parseInt(page) + 1));
        const result = blog?.comments.splice(3 * parseInt(page), (blog.comments.length - 3 * parseInt(page)) < 3 ? (blog.comments.length - 3 * parseInt(page)) : 3);
        return result;
    } catch (error) {
        console.log({error});
    }
}

const createBlog = async (blog) => {
    try {
        const newBlog = new Blog({
            ...blog,
            likes: 0,
            createdAt: await util.time.beautifyDate(new Date())
        });
        await newBlog.save();
        return newBlog;
    } catch (error) {
        console.log({error});
    }
}

//@Todo: fix lỗi mất thumbnail khi update
const updateBlog = async (blog) => {
    try {
        const updateableFields = ["name", "thumbnail", "content", "description"];
        const updatingFields = Object.keys(blog);
        if (!blog.thumbnail) {
            delete blog.thumbnail;
        }
        const updatingBlog = await Blog.findById(blog.id);
        // console.log(updatingBlog);
        // console.log(updatingBlog.description);
        updatingFields.forEach((updatingField) => {
            if (updateableFields.find(updateableField => updateableField === updatingField)) {
                updatingBlog[updatingField] = blog[updatingField];
            }
        })
        await updatingBlog.save();
        return updatingBlog;
    } catch (error) {
        console.log({error});
    }
}

const likeBlog = async (userId, blogId) => {
    try {
        const blog = await Blog.findById(blogId);
        if (blog.likes.find(like => like.user.toString() === userId.toString())) {
            throw 'You have liked this post already!';
        }
        blog.likes.push({ user: userId });
        await blog.save();
        return {
            _id: blog._id,
            likes: blog.likes
        }
    } catch (error) {
        console.log({error});
    }
}

const dislikeBlog = async (userId, blogId) => {
    try {
        const blog = await Blog.findById(blogId);
        if (!blog.likes.find(like => like.user.toString() === userId.toString())) {
            throw 'You haven\'t liked this post yet!';
        }
        blog.likes = blog.likes.filter(like => like.user.toString() !== userId.toString());
        await blog.save();
        return {
            _id: blog._id,
            likes: blog.likes
        }
    } catch (error) {
        console.log({error});
    }
}

const commentBlog = async (user, blogId, comment) => {
    try {
        console.log(comment);
        const blog = await Blog.findById(blogId);
        if (!blogId) {
            throw 'Blog not found';
        }
        blog.comments.unshift({
            user: user._id,
            content: comment
        });
        await blog.save();
        return {
            comment: {
                _id: blog._id,
                user,
                content: comment
            },
            commentCount: blog.comments.length
        };
    } catch (error) {
        console.log({error});
    }
}

const deleteBlog = async (id) => {
    try {
        await Blog.deleteOne({_id: id});
        return;
    } catch (error) {
        console.log({error});
    }
}

module.exports = {
    getBlogs,
    getBlog,
    getCommentsBlog,
    createBlog,
    updateBlog,
    likeBlog,
    dislikeBlog,
    commentBlog,
    deleteBlog
}