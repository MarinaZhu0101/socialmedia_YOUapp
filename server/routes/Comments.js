const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { validateToken } = require('../middlewares/Authmiddleware');

router.get("/:id", CommentController.getComments);
router.post("/:id", validateToken, CommentController.createComment);


module.exports = router;