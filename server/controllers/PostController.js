const PostModel = require('../models/PostModel');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const LikeModel = require('../models/LikeModel');
const cloudinary = require('cloudinary').v2;

//save in uploads file
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadsDir = path.join(__dirname, '../uploads');
//         fs.mkdirSync(uploadsDir, { recursive: true });
//         cb(null, uploadsDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     }
// });

cloudinary.config({
    cloud_name: 'ddpcfgovd',
    api_key: '942634993361433',
    api_secret: 'pPtxHwZr62uWa1-P_8gpIiQZLFM'
  });

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
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
            // console.log("Request received."); 
            const userId = req.user ? req.user.userId : undefined;
            // console.log("User ID:", userId); 

            const posts = await PostModel.getAllPosts(userId);
            // console.log("Fetched posts:", posts);

            if (!posts || posts.length === 0) {
                console.log("No posts found.");
                return res.status(404).send('No posts found.');
            }

            res.json(posts);
            //res.status(200).send("ok");
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
                // const imagePath = req.file.path;
                // const postData = {
                //     user_id: userId,
                //     image_url: imagePath,
                //     post_date: new Date()
                // };

                // Upload file to Cloudinary
                const result = await cloudinary.uploader.upload(req.file.path, {
                    format: 'jpg',
                    folder: '', // Upload to the root directory
                    public_id: req.file.filename,
                    use_filename: true,
                    unique_filename: false
                });

                // Delete the file from the local uploads directory
                fs.unlinkSync(req.file.path);

                // Save post data to the database
                const postData = {
                    user_id: userId,
                    image_url: result.secure_url,
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
