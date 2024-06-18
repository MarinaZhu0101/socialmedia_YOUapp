const mongoose = require('mongoose');
const { Schema } = mongoose;
const LikeModel = require('./LikeModel'); 
const { User } = require('./UserModel'); 

const postSchema = new Schema({
    post_id: { type: Number, required: true, unique: true },
    user_id: { type: Number, ref: 'User', required: true },
    image_url: { type: String, required: true },
    post_date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

class PostModel {

    static async getAllPosts(userId) {
        try {
            // console.log("Fetching posts from DB...");
            // const posts = await Post.find()
            //     .populate({ path: 'user_id', select: 'user_name', model: User}) 
            //     .lean(); // 使用 lean 方法返回普通的 JavaScript 对象
            const posts = await Post.find().lean();
            //降序排列
            
            for (const post of posts) {
                // console.log("Processing post:", post.post_id);
                post.likesCount = await new Promise((resolve, reject) => {
                    LikeModel.getLikesByPostId(post.post_id)
                        .then(userIds => {
                            // console.log(`Fetched likes for post ${post.post_id}:`, userIds.length); // 添加成功日志
                            resolve(userIds.length);
                        })
                        .catch(error => {
                            // console.log(`Error fetching likes for post ${post.post_id}:`, error); // 添加错误日志
                            reject(error);
                        });
                });
                // console.log(`Post ID: ${post.post_id}, Likes Count: ${post.likesCount}`);
                
                if (userId) { // 仅在 userId 存在时检查是否点赞
                    post.isLikedByCurrentUser = await new Promise((resolve, reject) => {
                        LikeModel.checkUserLike(userId, post.post_id)
                            .then(hasLiked => {
                                // console.log(`Checked like for user ${userId} on post ${post.post_id}:`, hasLiked); // 添加成功日志
                                resolve(hasLiked);
                            })
                            .catch(error => {
                                // console.log(`Error checking like for user ${userId} on post ${post.post_id}:`, error); // 添加错误日志
                                reject(error);
                            });
                    });
                    // console.log(`Post ID: ${post.post_id}, isLikedByCurrentUser: ${post.isLikedByCurrentUser}`); // 打印是否被当前用户点赞

                } else {
                    post.isLikedByCurrentUser = false; // 如果没有 userId，设置为 false
                    // console.log(`Post ID: ${post.post_id}, isLikedByCurrentUser set to false`); // 打印默认的点赞状态
                }
                 // 手动查询 user_name
                const user = await User.findOne({ user_id: post.user_id }).select('user_name').lean();
                if (user) {
                    post.user_name = user.user_name;
                } else {
                    post.user_name = null;
                }
            }

            // console.log("Final posts data:", posts); 
            return posts;
        } catch (error) {
            console.error("Error fetching all posts:", error);
            throw error;
        }
    }

    static async getPostById(postId, userId) {
        try {
            // const post = await Post.findOne({ post_id: postId })
            //     .populate({ path: 'user_id', select: 'user_name', model: User})
            //     .lean();
            const post = await Post.findOne({ post_id: postId }).lean();

            if (post) {
                post.likesCount = await new Promise((resolve, reject) => {
                    LikeModel.getLikesByPostId(post.post_id)
                        .then(userIds => {
                            // console.log(`Fetched likes for post ${post.post_id}:`, userIds.length); // 添加成功日志
                            resolve(userIds.length);
                        })
                        .catch(error => {
                            console.log(`Error fetching likes for post ${post.post_id}:`, error); // 添加错误日志
                            reject(error);
                        });
                });
                
                if (userId) { // 修改：仅在 userId 存在时检查是否点赞
                    post.isLikedByCurrentUser = await new Promise((resolve, reject) => {
                        LikeModel.checkUserLike(userId, post.post_id)
                            .then(hasLiked => {
                                // console.log(`Checked like for user ${userId} on post ${post.post_id}:`, hasLiked); // 添加成功日志
                                resolve(hasLiked);
                            })
                            .catch(error => {
                                console.log(`Error checking like for user ${userId} on post ${post.post_id}:`, error); // 添加错误日志
                                reject(error);
                            });
                    });
                } else {
                    post.isLikedByCurrentUser = false; // 如果没有 userId，设置为 false
                }
                // 手动查询 user_name
                const user = await User.findOne({ user_id: post.user_id }).select('user_name').lean();
                if (user) {
                    post.user_name = user.user_name;
                } else {
                    post.user_name = null;
                }
            }

            return post;
        } catch (error) {
            console.error("Error fetching post by ID:", error);
            throw error;
        }
    }

    static async createPost(postData) {
        try {
            const postId = this.generateUniqueId();
            const post = new Post({ ...postData, post_id: postId });
            const savedPost = await post.save();
            return savedPost;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    }

    static generateUniqueId() {
        return Math.floor(Math.random() * 900000) + 100000;
    }
}

module.exports = PostModel;
