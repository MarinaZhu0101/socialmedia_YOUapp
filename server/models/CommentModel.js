const connection = require('./db.js');

class CommentModel {
    static getCommentsByPostId(postId, callback) {
        const query = `
        SELECT comments.*, users.user_name 
        FROM comments 
        INNER JOIN users ON comments.user_id = users.user_id
        WHERE comments.post_id = ?`;
        connection.query(query, [postId], callback);
    }

    static createComment(commentData, callback) {
        const query = "INSERT INTO comments SET ?";
        connection.query(query, commentData, (error, results) => {
            if (error) {
                console.log("Error in createComment:", error);
            }
            callback(error, results);
        });
    }
    

}

module.exports = CommentModel;
