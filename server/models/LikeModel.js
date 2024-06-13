// const connection = require('./db.js');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const likeSchema = new Schema({
    like_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    post_id: { type: Number, required: true },
});

const Like = mongoose.model('Like', likeSchema);

class LikeModel {
    // static getLikesByPostId(postId, callback) {
    //     const query = "SELECT user_id FROM likes WHERE post_id = ?";
    //     connection.query(query, [postId], (error, results) => {
    //         if (error) {
    //             console.log("Error in getLikesDetailByPostId:", error);
    //             return callback(error, null);
    //         }
      
    //         const userIds = results.map(row => row.user_id);
    //         callback(null, userIds);
    //     });
    // }
    static async getLikesByPostId(postId) {
        try {
            const results = await Like.find({ post_id: postId }, 'user_id');
            return results.map(like => like.user_id);
        } catch (error) {
            console.log("Error in getLikesByPostId:", error);
            throw error;
        }
    }

    // static addLike(likeData, callback) {
    //     this.checkUserLike(likeData.user_id, likeData.post_id, (error, hasLiked) => {
    //         if (error) {
    //             console.error("Error checking user like:", error);
    //             return callback(error);
    //         }
    //         if (hasLiked) {
    //             console.log("User already liked this post.");
    //             return callback(null, { alreadyLiked: true, message: "User already liked this post." });
    //         } else {
    //             const query = "INSERT INTO likes SET ?";
    //             connection.query(query, likeData, (error, results) => {
    //                 if (error) {
    //                     console.error("Error in addLike:", error);
    //                     return callback(error, null);
    //                 }
    //                 console.log("Add like successful");
    //                 callback(null, { success: true, message: "Like added successfully.", results });
    //             });
    //         }
    //     });
    // }
    static async addLike(likeData) {
        try {
            const hasLiked = await this.checkUserLike(likeData.user_id, likeData.post_id);
            if (hasLiked) {
                console.log("User already liked this post.");
                return { alreadyLiked: true, message: "User already liked this post." };
            } else {
                const like = new Like(likeData);
                const result = await like.save();
                console.log("Add like successful");
                return { success: true, message: "Like added successfully.", result };
            }
        } catch (error) {
            console.error("Error in addLike:", error);
            throw error;
        }
    }


    // static removeLike(userId, postId, callback) {

    //     this.checkUserLike(userId, postId, (error, hasLiked) => {
    //         if (error) {
    //             console.error("Error checking user like before removal:", error);
    //             return callback(error);
    //         }
    //         if (!hasLiked) {
    //             console.log("No like found to remove.");
    //             return callback(null, { notFound: true, message: "Like not found." });
    //         } else {
    //             const query = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
    //             connection.query(query, [userId, postId], (error, results) => {
    //                 if (error) {
    //                     console.error("Error in removeLike:", error);
    //                     return callback(error);
    //                 }
    //                 console.log("Remove like successful");
    //                 callback(null, { success: true, message: "Like removed successfully.", results });
    //             });
    //         }
    //     });
    // }
    static async removeLike(userId, postId) {
        try {
            const hasLiked = await this.checkUserLike(userId, postId);
            if (!hasLiked) {
                console.log("No like found to remove.");
                return { notFound: true, message: "Like not found." };
            } else {
                const result = await Like.deleteOne({ user_id: userId, post_id: postId });
                console.log("Remove like successful");
                return { success: true, message: "Like removed successfully.", result };
            }
        } catch (error) {
            console.error("Error in removeLike:", error);
            throw error;
        }
    }
    
    // static checkUserLike(userId, postId, callback) {
    //     const query = "SELECT * FROM likes WHERE user_id = ? AND post_id = ?";
    //     connection.query(query, [userId, postId], (error, results) => {
    //         if (error) {
    //             console.log("Error in checkUserLike:", error);
    //         }
    //         const hasLiked = results.length > 0;
    //         callback(error, hasLiked);
    //     });
    // }
    static async checkUserLike(userId, postId) {
        try {
            const result = await Like.findOne({ user_id: userId, post_id: postId });
            return !!result;
        } catch (error) {
            console.log("Error in checkUserLike:", error);
            throw error;
        }
    }

}

module.exports = LikeModel;
