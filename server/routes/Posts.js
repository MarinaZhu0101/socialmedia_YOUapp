const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { validateToken } = require('../middlewares/Authmiddleware');

router.get("/", validateToken,PostController.getAllPosts);
router.get("/byId/:id", validateToken, PostController.getPostById);
router.post("/", validateToken, PostController.createPost);


module.exports = router;




