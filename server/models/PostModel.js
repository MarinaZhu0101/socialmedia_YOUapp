const { post } = require('../routes/Posts.js');
const connection = require('./db.js');

class PostModel {
 
    static getAllPosts(userId, callback) {
        const query = `
            SELECT 
            posts.*, 
            users.user_name, 
            COUNT(likes.post_id) AS likesCount,
            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.post_id = posts.post_id AND likes.user_id = ?
            ) AS isLikedByCurrentUser
            FROM posts
            INNER JOIN users ON posts.user_id = users.user_id
            LEFT JOIN likes ON posts.post_id = likes.post_id
            GROUP BY posts.post_id, users.user_name;
        `;
        connection.query(query, [userId], callback);
    }

    static getPostById(postId, userId, callback) {
        const query = `
            SELECT 
            posts.*, 
            users.user_name, 
            COALESCE(COUNT(likes.post_id), 0) AS likesCount,
            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.post_id = posts.post_id AND likes.user_id = ?
            ) AS isLikedByCurrentUser
            FROM posts 
            INNER JOIN users ON posts.user_id = users.user_id 
            LEFT JOIN likes ON posts.post_id = likes.post_id
            WHERE posts.post_id = ?
            GROUP BY posts.post_id, users.user_name;
        `;
        connection.query(query, [userId, postId], callback);
    }
    

    static createPost(postData, callback) {
        const query = "INSERT INTO posts SET ?";
        connection.query(query, postData, callback);
    }


}

module.exports = PostModel;
