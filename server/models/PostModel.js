const mongoose = require('mongoose');
const { Schema } = mongoose;
const LikeModel = require('./LikeModel'); 
const UserModel = require('./UserModel'); 

const postSchema = new Schema({
    post_id: { type: Number, required: true, unique: true },
    user_id: { type: String, required: true },
    image_url: { type: String, required: true },
    post_date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

class PostModel {

    static async getAllPosts(userId) {
        try {
            const posts = await Post.find()
                .populate('user_id', 'user_name -_id') // 只选取 user_name 字段，并排除 _id
                .lean(); // 使用 lean 方法返回普通的 JavaScript 对象
            
            for (const post of posts) {
                post.likesCount = await new Promise((resolve, reject) => {
                    LikeModel.getLikesByPostId(post.post_id, (error, userIds) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(userIds.length);
                        }
                    });
                });
                
                post.isLikedByCurrentUser = await new Promise((resolve, reject) => {
                    LikeModel.checkUserLike(userId, post.post_id, (error, hasLiked) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(hasLiked);
                        }
                    });
                });
            }

            return posts;
        } catch (error) {
            console.error("Error fetching all posts:", error);
            throw error;
        }
    }

    static async getPostById(postId, userId) {
        try {
            const post = await Post.findOne({ post_id: postId })
                .populate('user_id', 'user_name -_id')
                .lean();

            if (post) {
                post.likesCount = await new Promise((resolve, reject) => {
                    LikeModel.getLikesByPostId(post.post_id, (error, userIds) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(userIds.length);
                        }
                    });
                });
                
                post.isLikedByCurrentUser = await new Promise((resolve, reject) => {
                    LikeModel.checkUserLike(userId, post.post_id, (error, hasLiked) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(hasLiked);
                        }
                    });
                });
            }

            return post;
        } catch (error) {
            console.error("Error fetching post by ID:", error);
            throw error;
        }
    }

    static async createPost(postData) {
        try {
            const post = new Post(postData);
            await post.save();
            return post;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }
}

module.exports = PostModel;
