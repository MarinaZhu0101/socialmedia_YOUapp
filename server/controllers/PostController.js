const PostModel = require('../models/PostModel');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const LikeModel = require('../models/LikeModel');

//save in uploads file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('image');

class PostController {
    
    static getAllPosts(req, res) {
        const userId = req.user ? req.user.userId : undefined;
        // console.log(`Fetching posts for user: ${userId}`);

        PostModel.getAllPosts(userId, (error, results) => {
            if (error) {
                console.error("Error fetching posts:", error);
                return res.status(500).send("Error fetching posts.");
            }
            // console.log(`Fetched ${results.length} posts.`);
        
            const postsWithLikeStatus = results.map(post => ({
                ...post,
                isLikedByCurrentUser: post.isLikedByCurrentUser
            }));
        
            res.json(postsWithLikeStatus);
        });

    }

    static getPostById(req, res) {
        const postId = req.params.id;
        const userId = req.user ? req.user.userId : undefined;
        // console.log(`Fetching post with ID: ${postId} for user ID: ${userId}`);
        PostModel.getPostById(postId, userId, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Database query error.');
            }
            if (result.length === 0) {
                return res.status(404).send('Post not found.');
            }
            res.json(result[0]);
        });
    }

    static createPost(req, res) {
        upload(req, res, (uploadError) => {
            if (uploadError) {
                console.error(uploadError);
                return res.status(500).send('File upload error.');
            }
            const userId = req.user.userId;
            const imagePath = "/uploads/" + req.file.filename;
            const postData = {
                user_id: userId,
                image_url: imagePath,
                post_date: new Date()
            };

            PostModel.createPost(postData, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Database query error.');
                }
                console.log("Image data saved to the database");
                res.status(201).json({ message: "Image uploaded successfully", imagePath });
            });
        });
    }
    
}

module.exports = PostController;
