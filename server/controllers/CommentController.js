const CommentModel = require('../models/CommentModel');

class CommentController {
    static async getComments(req, res) {
        const postId = req.params.id;
        // console.log(`Fetching comments for post ID ${postId}`); // 添加调试信息

        try {
            const comments = await CommentModel.getCommentsByPostId(postId);
            if (!comments || comments.length === 0) {
                // console.log("No comments found for post ID:", postId); // 打印无评论信息
                return res.status(404).send('No comments found.');
            }
            // console.log("Fetched comments in controller:", comments); // 打印获取到的评论
            res.json(comments); // 返回评论数据
        } catch (error) {
            console.error("Database query error:", error); // 打印错误日志
            res.status(500).send('Database query error.');
        }
    }

    static async createComment(req, res) {
        const commentData = {
            user_id: req.user.userId,
            post_id: req.params.id,
            comment_content: req.body.comment,
            comment_date: new Date()
        };

        try {
            await CommentModel.createComment(commentData);
            const comments = await CommentModel.getCommentsByPostId(commentData.post_id);
            res.status(201).json(comments);
        } catch (error) {
            console.error("Database query error:", error); // 打印错误日志
            res.status(500).send('Database query error.');
        }
    }
    
}

module.exports = CommentController;
