const connection = require('./db.js');

class LikeModel {
    static getLikesByPostId(postId, callback) {
        const query = "SELECT user_id FROM likes WHERE post_id = ?";
        connection.query(query, [postId], (error, results) => {
            if (error) {
                console.log("Error in getLikesDetailByPostId:", error);
                return callback(error, null);
            }
      
            const userIds = results.map(row => row.user_id);
            callback(null, userIds);
        });
    }

    static addLike(likeData, callback) {
        this.checkUserLike(likeData.user_id, likeData.post_id, (error, hasLiked) => {
            if (error) {
                console.error("Error checking user like:", error);
                return callback(error);
            }
            if (hasLiked) {
                console.log("User already liked this post.");
                return callback(null, { alreadyLiked: true, message: "User already liked this post." });
            } else {
                const query = "INSERT INTO likes SET ?";
                connection.query(query, likeData, (error, results) => {
                    if (error) {
                        console.error("Error in addLike:", error);
                        return callback(error, null);
                    }
                    console.log("Add like successful");
                    callback(null, { success: true, message: "Like added successfully.", results });
                });
            }
        });
    }


    static removeLike(userId, postId, callback) {

        this.checkUserLike(userId, postId, (error, hasLiked) => {
            if (error) {
                console.error("Error checking user like before removal:", error);
                return callback(error);
            }
            if (!hasLiked) {
                console.log("No like found to remove.");
                return callback(null, { notFound: true, message: "Like not found." });
            } else {
                const query = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
                connection.query(query, [userId, postId], (error, results) => {
                    if (error) {
                        console.error("Error in removeLike:", error);
                        return callback(error);
                    }
                    console.log("Remove like successful");
                    callback(null, { success: true, message: "Like removed successfully.", results });
                });
            }
        });
    }
    
    static checkUserLike(userId, postId, callback) {
        const query = "SELECT * FROM likes WHERE user_id = ? AND post_id = ?";
        connection.query(query, [userId, postId], (error, results) => {
            if (error) {
                console.log("Error in checkUserLike:", error);
            }
            const hasLiked = results.length > 0;
            callback(error, hasLiked);
        });
    }


}

module.exports = LikeModel;
