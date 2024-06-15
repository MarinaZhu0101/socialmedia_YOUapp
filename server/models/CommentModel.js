// const connection = require('./db.js');

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { User } = require('./UserModel'); 

const commentSchema = new Schema({
    comment_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    post_id: { type: Number, required: true },
    comment_date: { type: Date, default: Date.now },
    comment_content: { type: String, required: true },
});

const Comment = mongoose.model('Comment', commentSchema);

class CommentModel {
    static async getCommentsByPostId(postId) {
        try {
            // console.log(`Fetching comments for post ${postId}`); 
             // Fetch comments for the given post ID
            const comments = await Comment.find({ post_id: postId }).lean();
            for (const comment of comments) {
                // Manually query user_name
                const user = await User.findOne({ user_id: comment.user_id }).select('user_name').lean();
                if (user) {
                    comment.user_name = user.user_name;
                } else {
                    comment.user_name = 'Unknown User';
                }
            }
            // console.log("comments data:", comments); 
            return comments;
        } catch (error) {
            console.log("Error in getCommentsByPostId:", error);
            throw error;
        }
    }

    static async createComment(commentData) {
        try {
            const commentId = this.generateUniqueId();
            const comment = new Comment({ ...commentData, comment_id: commentId });
            const savedComment = await comment.save();

             // Fetch the user_name and add it to the saved comment
             const user = await User.findOne({ user_id: savedComment.user_id }).select('user_name').lean();
             const savedCommentWithUserName = savedComment.toObject();
             if (user) {
                 savedCommentWithUserName.user_name = user.user_name;
             } else {
                 savedCommentWithUserName.user_name = 'Unknown User';
             }

            return savedCommentWithUserName;
        } catch (error) {
            console.log("Error in createComment:", error);
            throw error;
        }
    }

    static generateUniqueId() {
        return Math.floor(Math.random() * 900000) + 100000;
    }
}

module.exports = CommentModel;
