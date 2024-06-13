// const { post } = require('../routes/Posts.js');
// const connection = require('./db.js');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    post_id: { type: Number, required: true },
    user_id: { type: String, required: true },
    image_url: { type: String, required: true },
    post_date: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

// class PostModel {
 
//     static getAllPosts(userId, callback) {
//         const query = `
//             SELECT 
//             posts.*, 
//             users.user_name, 
//             COUNT(likes.post_id) AS likesCount,
//             EXISTS (
//                 SELECT 1
//                 FROM likes
//                 WHERE likes.post_id = posts.post_id AND likes.user_id = ?
//             ) AS isLikedByCurrentUser
//             FROM posts
//             INNER JOIN users ON posts.user_id = users.user_id
//             LEFT JOIN likes ON posts.post_id = likes.post_id
//             GROUP BY posts.post_id, users.user_name;
//         `;
//         connection.query(query, [userId], callback);
//     }

//     static getPostById(postId, userId, callback) {
//         const query = `
//             SELECT 
//             posts.*, 
//             users.user_name, 
//             COALESCE(COUNT(likes.post_id), 0) AS likesCount,
//             EXISTS (
//                 SELECT 1
//                 FROM likes
//                 WHERE likes.post_id = posts.post_id AND likes.user_id = ?
//             ) AS isLikedByCurrentUser
//             FROM posts 
//             INNER JOIN users ON posts.user_id = users.user_id 
//             LEFT JOIN likes ON posts.post_id = likes.post_id
//             WHERE posts.post_id = ?
//             GROUP BY posts.post_id, users.user_name;
//         `;
//         connection.query(query, [userId, postId], callback);
//     }
    

//     static createPost(postData, callback) {
//         const query = "INSERT INTO posts SET ?";
//         connection.query(query, postData, callback);
//     }


// }

class PostModel {
    static getAllPosts(userId, callback) {
        Post.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'likes',
                    localField: 'post_id',
                    foreignField: 'post_id',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    isLikedByCurrentUser: {
                        $in: [userId, '$likes.user_id']
                    }
                }
            },
            {
                $project: {
                    'user.password': 0, // 排除敏感字段
                    'user.email': 0 // 排除敏感字段
                }
            }
        ]).exec(callback);
    }

    static getPostById(postId, userId, callback) {
        Post.aggregate([
            { $match: { post_id: postId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'likes',
                    localField: 'post_id',
                    foreignField: 'post_id',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likesCount: { $size: '$likes' },
                    isLikedByCurrentUser: {
                        $in: [userId, '$likes.user_id']
                    }
                }
            },
            {
                $project: {
                    'user.password': 0, // 排除敏感字段
                    'user.email': 0 // 排除敏感字段
                }
            }
        ]).exec(callback);
    }

    static createPost(postData, callback) {
        const post = new Post(postData);
        post.save(callback);
    }
}

module.exports = PostModel;
