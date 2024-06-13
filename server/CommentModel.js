// const connection = require('./db.js');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    comment_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    post_id: { type: Number, required: true },
    comment_date: { type: Date, default: Date.now },
    comment_content: { type: String, required: true },
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
