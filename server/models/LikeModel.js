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

    static async getLikesByPostId(postId) {
        try {
            // console.log(`Fetching likes for post ${postId}`); 
            const results = await Like.find({ post_id: postId }, 'user_id');
            const userIds = results.map(like => like.user_id);
            // console.log(`Fetched likes for post ${postId}:`, userIds); // 打印获取到的点赞信息
            return userIds;

        } catch (error) {
            console.log("Error in getLikesByPostId:", error);
            throw error;
        }
    }

    static async addLike(likeData) {
        try {
            const hasLiked = await this.checkUserLike(likeData.user_id, likeData.post_id);
            if (hasLiked) {
                return { alreadyLiked: true, message: "User already liked this post." };
            } else {
                const likeId = this.generateUniqueId();
                const like = new Like({ ...likeData, like_id: likeId });
                const result = await like.save();
                return { success: true, message: "Like added successfully.", result };
            }
        } catch (error) {
            console.error("Error in addLike:", error);
            throw error;
        }
    }

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
    
    static async checkUserLike(userId, postId) {
        try {
            // console.log(`Checking if user ${userId} likes post ${postId}`); 
            const result = await Like.findOne({ user_id: userId, post_id: postId });
            const hasLiked = !!result;
            // console.log(`User ${userId} likes post ${postId}:`, hasLiked); // 打印检查结果
            return hasLiked;
        } catch (error) {
            console.log("Error in checkUserLike:", error);
            throw error;
        }
    }

    static generateUniqueId() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

}

module.exports = LikeModel;
