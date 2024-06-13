// const connection = require('./db.js');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

class CommentModel {
    // static getCommentsByPostId(postId, callback) {
    //     const query = `
    //     SELECT comments.*, users.user_name 
    //     FROM comments 
    //     INNER JOIN users ON comments.user_id = users.user_id
    //     WHERE comments.post_id = ?`;
    //     connection.query(query, [postId], callback);
    // }
    static getCommentsByPostId(postId, callback) {
        Comment.find({ post_id: postId }).populate('user_id', 'user_name').exec(callback);
    }

    // static createComment(commentData, callback) {
    //     const query = "INSERT INTO comments SET ?";
    //     connection.query(query, commentData, (error, results) => {
    //         if (error) {
    //             console.log("Error in createComment:", error);
    //         }
    //         callback(error, results);
    //     });
    // }  
    static createComment(commentData, callback) {
        const comment = new Comment(commentData);
        comment.save(callback);
    }
}

module.exports = CommentModel;
