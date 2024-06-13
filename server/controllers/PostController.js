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
    
    static async getAllPosts(req, res) {
        try {
            const userId = req.user ? req.user.userId : undefined;
            const posts = await PostModel.getAllPosts(userId);

            if (!posts || posts.length === 0) {
                return res.status(404).send('No posts found.');
            }

            res.json(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
            res.status(500).send("Error fetching posts.");
        }
    }


    static async getPostById(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.user ? req.user.userId : undefined;
            const post = await PostModel.getPostById(postId, userId);

            if (!post) {
                return res.status(404).send('Post not found.');
            }

            res.json(post);
        } catch (error) {
            console.error("Error fetching post by ID:", error);
            res.status(500).send('Database query error.');
        }
    }

    static createPost(req, res) {
        upload(req, res, async (uploadError) => {
            if (uploadError) {
                console.error(uploadError);
                return res.status(500).send('File upload error.');
            }
            try {
                const userId = req.user.userId;
                const imagePath = "/uploads/" + req.file.filename;
                const postData = {
                    user_id: userId,
                    image_url: imagePath,
                    post_date: new Date()
                };

                const post = await PostModel.createPost(postData);

                res.status(201).json({ message: "Image uploaded successfully", post });
            } catch (error) {
                console.error("Error creating post:", error);
                res.status(500).send('Database query error.');
            }
        });
    }
    
}

module.exports = PostController;
