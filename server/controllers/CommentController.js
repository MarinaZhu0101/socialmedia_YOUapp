const CommentModel = require('../models/CommentModel');

class CommentController {
    static getComments(req, res) {
        const postId = req.params.id;
        CommentModel.getCommentsByPostId(postId, function(error, comments) {
            if (error) {
                return res.status(500).send('Database query error.');
            }
            if (comments.length === 0) {
                return res.status(404).send('Post not found.');
            }
            res.json(comments);
        });
    }

    static createComment(req, res) {
        const commentData = {
            user_id: req.user.userId,
            post_id: req.params.id,
            comment_content: req.body.comment,
            comment_date: new Date()
        };

        CommentModel.createComment(commentData, function(error, result) {
            if (error) {
                return res.status(500).send('Database query error.');
            }
            CommentModel.getCommentsByPostId(commentData.post_id, function(err, comments) {
                if (err) {
                    return res.status(500).send('Error fetching new comment.');
                }
                res.status(201).json(comments);
            });
        });
    }
    
}

module.exports = CommentController;
